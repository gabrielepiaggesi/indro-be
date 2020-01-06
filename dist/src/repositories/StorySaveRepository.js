"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../utils/Logger");
const Repository_1 = require("./Repository");
const QueryBuilder_1 = require("../utils/QueryBuilder");
const LOG = new Logger_1.Logger("StoryLikeRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
class StorySaveRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "stories_saved";
    }
}
exports.StorySaveRepository = StorySaveRepository;
//# sourceMappingURL=StorySaveRepository.js.map