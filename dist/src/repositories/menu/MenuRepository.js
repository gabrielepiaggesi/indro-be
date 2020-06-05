"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const LOG = new Logger_1.Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
const db = require("../../database");
class MenuRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "menus";
    }
    findByBusinessId(businessId, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query ||
            `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null`).then((results) => results);
    }
    getMenu(menuId, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query ||
            `select m.* as menu, mc.* as category, mi.* as item 
            from ${this.table} m 
            left join menus_categories mc on mc.menu_id = m.id and mc.deleted_at is null 
            left join menus_items mi on mi.category_id = mc.id and mi.deleted_at is null 
            where m.id = ${menuId} 
            and m.deleted_at is null 
            limit 1`).then((results) => results[0]);
    }
}
exports.MenuRepository = MenuRepository;
//# sourceMappingURL=MenuRepository.js.map