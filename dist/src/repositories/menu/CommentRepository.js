"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const LOG = new Logger_1.Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
const db = require("../../database");
class CommentRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "comments";
    }
    findByBusinessId(businessId, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query ||
            `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null 
            order by id desc `).then((results) => results);
    }
}
exports.CommentRepository = CommentRepository;
//# sourceMappingURL=CommentRepository.js.map