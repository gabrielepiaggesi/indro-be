import { Logger } from "../../utils/Logger";
import { StripeCustomerReq } from "./classes/StripeCustomerReq";
import { SubScriptionReq } from "./classes/SubScriptionReq";
import { StripeService } from "./StripeService";
import { StripeSubScriptionReq } from "./classes/StripeSubScriptionReq";
import { PaymentStatus } from "../../enums/financial/PaymentStatus";
import { UserStripe } from "../../models/financial/UserStripe";
import { Card } from "../../models/financial/Card";
import { StripePaymentMethodReq } from "./classes/StripePaymentMethodReq";
import { SubScription } from "../../models/financial/SubScription";
import { UserRepository } from "../../repositories/user/UserRepository";
import { PlanRepository } from "../../repositories/financial/PlanRepository";
import { StripeRepository } from "../../repositories/financial/StripeRepository";
import { CardRepository } from "../../repositories/financial/CardRepository";
import { SubScriptionRepository } from "../../repositories/financial/SubScriptionRepository";
import { TransactionReq } from "./classes/TransactionReq";
import { TransactionRepository } from "../../repositories/financial/TransactionRepository";
import { Transaction } from "../../models/financial/Transaction";
import { OperationSign } from "../../enums/financial/OperationSign";
import Stripe from "stripe";
const LOG = new Logger("PaymentService.class");
const stripeService = new StripeService();
const userRepository = new UserRepository();
const planRepository = new PlanRepository();
const stripeRepository = new StripeRepository();
const cardRepository = new CardRepository();
const subScriptionRepository = new SubScriptionRepository();
const transactionRepository = new TransactionRepository();

export class PaymentService {

    public async subscribeTo(obj: SubScriptionReq) {
        LOG.debug("subscribeTo", obj);
        const user = await userRepository.findById(obj.userId);
        const plan = await planRepository.findById(obj.planId);

        const userStripe = await this.updateUserStripeCustomer(user.id, user.email);
        const userCard = await this.updateUserStripePaymentMethod(user.id, obj.fingerprint, obj.paymentMethodId, userStripe.customer_id);
        const userSub = await this.updateUserStripeSubScription(user.id, userCard.id, userStripe.customer_id, plan.stripe_plan_id, plan.id);

        return userSub;
    }

    private async updateUserStripeCustomer(userId: number, userEmail: string) {
        let userStripe: UserStripe = await stripeRepository.findByUserId(userId);
        
        if (!userStripe) {
            const cus = await stripeService.getOrCreateStripeCustomer(new StripeCustomerReq(userEmail));
            
            userStripe = new UserStripe();
            userStripe.user_id = userId;
            userStripe.customer_id = cus.id;
            const userStripeInserted = await stripeRepository.save(userStripe);
            userStripe.id = userStripeInserted.insertId;
        }

        LOG.debug("updateUserStripeCustomer", userStripe.id);
        return userStripe;
    }

    private async updateUserStripePaymentMethod(userId: number, fingerprint: string, paymentMethodId: string, customerId: string) {
        let userCard: Card = await cardRepository.findByUserIdAndFingerprint(userId, fingerprint);
        
        if (!userCard) {
            const card = await stripeService.attachAndSetPaymentMethod(new StripePaymentMethodReq(paymentMethodId, customerId));
            
            userCard = new Card();
            userCard.user_id = userId;
            userCard.payment_method_id = card.id;
            userCard.last_4 = card.card.last4;
            userCard.fingerprint = card.card.fingerprint;
            userCard.three_d_secure_supported = card.card.three_d_secure_usage.supported;
            const userCardInserted = await cardRepository.save(userCard);
            userCard.id = userCardInserted.insertId;
        }

        LOG.debug("updateUserStripePaymentMethod", userCard.id);
        return userCard;
    }

    private async updateUserStripeSubScription(userId: number, cardId: number, customerId: string, stipePlanId: string, planId: number) {
        let userSub: SubScription = await subScriptionRepository.findByUserIdAndPlanId(userId, planId);
        
        if (!userSub) {
            const now = new Date(Date.now());
            const sub = await stripeService.getOrCreateStripeSubScription(new StripeSubScriptionReq(customerId, stipePlanId));
            userSub = await this.prepareUserTransaction(userId, planId, sub);
        }

        LOG.debug("updateUserStripeSubScription", userSub.id);
        return userSub;
    }

    private async prepareUserTransaction(userId, planId, sub: Stripe.Subscription) {
        let inv = await stripeService.getStripeInvoice(sub.latest_invoice['id']);
        let pi = await stripeService.getStripePaymentIntent(sub.latest_invoice['payment_intent']['id']);
        inv = inv || null;
        pi = pi || null;
        return await this.updateUserTransaction(userId, planId, sub, inv, pi);
    }

    private async updateUserTransaction(userId, planId, sub: Stripe.Subscription, inv: Stripe.Invoice, pi: Stripe.PaymentIntent) {
        const tra = new Transaction();
        tra.user_id = userId;
        tra.stripe_sub_id = sub.id || null;
        tra.stripe_payment_id = pi.id || null;
        tra.stripe_invoice_id = inv.id || null;
        tra.stripe_sub_status = sub.status;
        tra.stripe_payment_status = pi.status;
        tra.stripe_invoice_status = inv.status;
        tra.status = (tra.stripe_payment_status == 'succeeded') ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
        tra.currency = 'EUR';
        tra.amount = pi.amount / 100;
        tra.invoice_pdf_url = inv.invoice_pdf;
        tra.stripe_payment_method = pi.payment_method.toString();
        tra.operation_sign = OperationSign.NEGATIVE;
        tra.operation_resume = -tra.amount;
        const traInserted = await transactionRepository.save(tra);
        LOG.debug('new transaction', traInserted.insertId);
        return await this.updateUserSubscription(tra, planId);
    }

    private async updateUserSubscription(obj: Transaction, planId) {
        const now = new Date(Date.now());
        let userSub = new SubScription();
        userSub.subscription_id = obj.stripe_sub_id;
        userSub.user_id = obj.user_id;
        userSub.plan_id = planId;
        userSub.status = (obj.stripe_payment_status == 'succeeded') ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
        userSub.resume_status = obj.stripe_sub_status + '.' + obj.stripe_invoice_status + '.' + obj.stripe_payment_status;
        userSub.subscription_status = obj.stripe_sub_status;
        userSub.last_renew = now.toISOString();
        userSub.next_renew = new Date((now.setMonth(now.getMonth() + 1))).toISOString();
        const userSubInserted = await subScriptionRepository.save(userSub);
        userSub.id = userSubInserted.insertId;

        if (userSub.status == PaymentStatus.SUCCESS) {
            const user = await userRepository.findById(obj.user_id);
            user.status = 'active';
            const userUpdated = await userRepository.update(user);
        }

        return userSub;
    }
}
