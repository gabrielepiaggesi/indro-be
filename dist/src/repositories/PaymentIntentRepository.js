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
const Logger_1 = require("../utils/Logger");
const Repository_1 = require("./Repository");
const LOG = new Logger_1.Logger("UserRepository.class");
class PaymentIntentRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "payments_intents";
    }
    findByName(name, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }
    // tslint:disable-next-line:max-line-length
    updateByIdWithStatusWithDeletedAt(piId, status, deletedAt, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            query = query ||
                `update ${this.table} set status = "${status}", deleted_at = ${deletedAt ? `"${deletedAt}"` : null} where id = ${piId}`;
            return yield this.db.query(query).then((results) => results);
        });
    }
}
exports.PaymentIntentRepository = PaymentIntentRepository;
//# sourceMappingURL=PaymentIntentRepository.js.map