"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const LOG = new Logger_1.Logger("UserRepository.class");
class DetailRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "details";
    }
    findByType(type, userId, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where type = "${type}" and user_id = ${userId} and deleted_at is null order by start_date desc`).then((results) => results);
    }
}
exports.DetailRepository = DetailRepository;
//# sourceMappingURL=DetailRepository.js.map