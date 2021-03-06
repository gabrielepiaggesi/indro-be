"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
const mysql_1 = __importDefault(require("mysql"));
class TransactionRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "transactions";
    }
    findByUser(userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            query = `
        select tra.amount, 
        tra.operation_resume, 
        tra.created_at, 
        tra.stripe_payment_status, 
        tra.stripe_invoice_status, 
        tra.invoice_pdf_url, 
        tra.status as tra_status, 
        tra.stripe_payment_method as tra_payment_method_id, 
        tra.id as tra_id, 
        card.id as card_id,
        card.last_4, 
        card.payment_method_id as card_payment_method_id, 
        plan.title, 
        plan.id as plan_id,
        sub.subscription_id as sub_stripe_subscription_id,
        sub.id as sub_id 
        from transactions tra 
        inner join subscriptions sub on sub.subscription_id = tra.stripe_sub_id and sub.deleted_at is null 
        inner join cards card on card.payment_method_id = tra.stripe_payment_method and card.deleted_at is null 
        inner join plans plan on plan.id = sub.plan_id and plan.deleted_at is null 
        where tra.user_id = ${userId} 
        and tra.deleted_at is null 
        order by tra.created_at desc limit 10 
        `;
            return yield c.query(query).then((results) => results);
        });
    }
    findByPaymentIntentId(piId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select * from transactions where stripe_payment_id = ${mysql_1.default.escape(piId)} and deleted_at is null order by id desc limit 1`;
            return yield c.query(query || q).then((results) => results[0]);
        });
    }
    findLastOfUserIdAndSubId(userId, subId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select * from transactions where user_id = ${userId} and stripe_sub_id = ${mysql_1.default.escape(subId)} and deleted_at is null order by id desc limit 1`;
            return yield c.query(query || q).then((results) => results[0]);
        });
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=TransactionRepository.js.map