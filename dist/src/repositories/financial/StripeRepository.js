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
const Repository_1 = require("../Repository");
class StripeRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "stripes";
    }
    findByUserId(userId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `select * from stripes where user_id = ${userId} and deleted_at is null`;
            return yield this.db.query(query || q).then((results) => results[0]);
        });
    }
    findByCustomerId(cId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `select * from stripes where customer_id = "${cId}" and deleted_at is null`;
            return yield this.db.query(query || q).then((results) => results[0]);
        });
    }
}
exports.StripeRepository = StripeRepository;
//# sourceMappingURL=StripeRepository.js.map