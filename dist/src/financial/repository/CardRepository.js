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
const db = require("../../connection");
const mysql_1 = __importDefault(require("mysql"));
const Repository_1 = require("../../framework/repositories/Repository");
class CardRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "cards";
    }
    findByUserId(userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select * from cards where user_id = ${userId} and deleted_at is null order by created_at desc`;
            return yield c.query(query || q).then((results) => results);
        });
    }
    findByUserIdAndFingerprint(userId, fingerprint, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select * from cards where user_id = ${userId} and fingerprint = ${mysql_1.default.escape(fingerprint)} and deleted_at is null`;
            return yield c.query(query || q).then((results) => results[0]);
        });
    }
    resetNotPrincipalCard(userId, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `
        update cards set principal = false where user_id = ${userId}`;
            return yield c.query(q).then((results) => results[0]);
        });
    }
}
exports.CardRepository = CardRepository;
//# sourceMappingURL=CardRepository.js.map