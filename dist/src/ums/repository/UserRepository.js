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
const mysql2_1 = __importDefault(require("mysql2"));
class UserRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "users";
    }
    // ${mysql2.escape(stripeId)}
    whereUserIdIn(userIds, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userIds.length)
                return [];
            const c = conn;
            return c.query(query ||
                `select * 
            from ${this.table} 
            where id in (?) order by id asc`, [userIds]).then((results) => results);
        });
    }
    findByUserName(username, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `select * from ${this.table} where username = ${mysql2_1.default.escape(username)} limit 1`).then((results) => results[0]);
        });
    }
    findByEmailAndPassword(email, password, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `select * from ${this.table} where email = ${mysql2_1.default.escape(email)} and password = ${mysql2_1.default.escape(password)} limit 1`).then((results) => results[0]);
        });
    }
    findByEmail(email, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `select * from ${this.table} where email = ${mysql2_1.default.escape(email)} limit 1`).then((results) => results[0]);
        });
    }
    findTotalUsers(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select count(*) as count from preorders`;
            return yield c.query(query || q).then((results) => results[0]);
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map