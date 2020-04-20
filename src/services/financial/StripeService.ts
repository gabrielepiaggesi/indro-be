import { Logger } from "../../utils/Logger";
import { StripeCustomerReq } from "./classes/StripeCustomerReq";
import Stripe from 'stripe';
import { StripePaymentMethodReq } from "./classes/StripePaymentMethodReq";
import { StripeSubScriptionReq } from "./classes/StripeSubScriptionReq";
const stripe = new Stripe('sk_test_g7a5tHbE9UvEBUNuTFSsFYvu00x2rejFec', null);
const LOG = new Logger("StripeService.class");

export class StripeService {
    // https://stripe.com/docs/billing/subscriptions/payment

    public async getOrCreateStripeCustomer(obj: StripeCustomerReq) {
        const cusFound = await stripe.customers.list(obj).then(list => list.data);
        if (cusFound.length > 0) {
            LOG.debug("found stripe customer", obj.email);
            return cusFound[0];
        } else {
            LOG.debug("creating stripe customer", obj.email);
            return await stripe.customers.create(obj).then(cus => cus);
        }
    }

    public async getStripeCustomer(obj: StripeCustomerReq): Promise<any[]> {
        // create new stripe customer
        return await stripe.customers.list(obj).then(list => list.data);
    }

    public async createStripeCustomer(obj: StripeCustomerReq): Promise<any> {
        // create new stripe customer
        return await stripe.customers.create(obj).then(cus => cus);
    }

    public async attachAndSetPaymentMethod(obj: StripePaymentMethodReq) {
        // attach new payment method for stripe customer
        LOG.debug("attaching card", obj.customer);
        const pm = await stripe.paymentMethods.attach(obj.payment_method_id, { customer: obj.customer }).then(pm => pm);
        // set this new pm as default for this customer
        LOG.debug("set default card", obj.payment_method_id);
        const cus = await stripe.customers.update(obj.customer, { invoice_settings: { default_payment_method: pm.id } }).then(cus => cus);
        return pm;
    }

    public async attachPaymentMethod(obj: StripePaymentMethodReq) {
        // attach new payment method for stripe customer
        await stripe.paymentMethods.attach(obj.payment_method_id, { customer: obj.customer });
        return true;
    }

    public async setPaymentMethod(obj: StripePaymentMethodReq) {
        // set this pm as default for this customer
        await stripe.customers.update(obj.customer, { invoice_settings: { default_payment_method: obj.payment_method_id } });
        return true;
    }

    public async getOrCreateStripeSubScription(obj: StripeSubScriptionReq) {
        const cusFound = await this.getStripeSubscriptions(obj).then(list => list);
        if (cusFound.length > 0) {
            LOG.debug("found subscription", obj.customerId);
            return cusFound[0];
        } else {
            LOG.debug("creating stripe subscription", obj.customerId);
            return await this.createStripeSubscription(obj).then(sub => sub);
        }
    }

    public async createStripeSubscription(obj: StripeSubScriptionReq) {
        // create new stripe subscription for current customer
        const sub = { customer: obj.customerId, items: [{ plan: obj.planId }], expand: [obj.expand] };
        return await stripe.subscriptions.create(sub).then(sub => sub);
    }

    public async getStripeSubscriptions(obj: StripeSubScriptionReq) {
        const sub = { customer: obj.customerId, plan: obj.planId };
        return await stripe.subscriptions.list(sub).then(list => list.data);
    }
}
