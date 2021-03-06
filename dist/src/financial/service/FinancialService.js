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
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const PaymentService_1 = require("./PaymentService");
const SubScription_1 = require("../model/SubScription");
const SubScriptionRepository_1 = require("../repository/SubScriptionRepository");
const TransactionRepository_1 = require("../repository/TransactionRepository");
const CardRepository_1 = require("../repository/CardRepository");
const UserRepository_1 = require("../../ums/repository/UserRepository");
const middleware_1 = require("../../framework/integrations/middleware");
const StripeService_1 = require("./StripeService");
const LOG = new Logger_1.Logger("FinancialService.class");
const userRepository = new UserRepository_1.UserRepository();
const paymentService = new PaymentService_1.PaymentService();
const subScriptionRepository = new SubScriptionRepository_1.SubScriptionRepository();
const transactionRepository = new TransactionRepository_1.TransactionRepository();
const cardRepository = new CardRepository_1.CardRepository();
const stripeService = new StripeService_1.StripeService();
const db = require("../../connection");
class FinancialService {
    cancelSubScription(res, subId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sub = yield stripeService.cancelStripeSubscription(subId);
                return res.status(200).send(sub);
            }
            catch (e) {
                LOG.error("cancel subscription error", e);
                let msg = (e.message) ? e.message : null;
                let error_code = (e.code) ? e.code : null;
                let decline_code = (e.decline_code) ? e.decline_code : null;
                return res.status(500).send({ msg, error_code, decline_code });
            }
        });
    }
    payUserSubScription(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = req.body;
            LOG.debug("payUserSubScription", obj);
            const userLogged = middleware_1.auth.getLoggedUserId(req);
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                const user = yield userRepository.findById(userLogged, connection);
                LOG.debug("user", user.id);
                obj.userId = user.id;
                const subscription = yield paymentService.subscribeTo(obj, connection);
                yield connection.commit();
                yield connection.release();
                return res.status(200).send(subscription);
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new subscription error", e);
                let msg = (e.message) ? e.message : null;
                let error_code = (e.code) ? e.code : null;
                let decline_code = (e.decline_code) ? e.decline_code : null;
                return res.status(500).send({ msg, error_code, decline_code });
            }
        });
    }
    getUserSubScription(res, req, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getUserSubScription");
            const userLogged = middleware_1.auth.getLoggedUserId(req);
            const connection = yield db.connection();
            let userSub = yield subScriptionRepository.findCurrentSubForUser(userLogged, planId, connection);
            yield connection.release();
            userSub = userSub || new SubScription_1.SubScription();
            return res.status(200).send(userSub);
        });
    }
    getUserTransactions(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getUserTransactions");
            const userLogged = middleware_1.auth.getLoggedUserId(req);
            const connection = yield db.connection();
            let userTras = yield transactionRepository.findByUser(userLogged, connection);
            yield connection.release();
            return res.status(200).send(userTras);
        });
    }
    getUserCards(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getUserCards");
            const userLogged = middleware_1.auth.getLoggedUserId(req);
            const connection = yield db.connection();
            let userTras = yield cardRepository.findByUserId(userLogged, connection);
            yield connection.release();
            return res.status(200).send(userTras);
        });
    }
}
exports.FinancialService = FinancialService;
//# sourceMappingURL=FinancialService.js.map