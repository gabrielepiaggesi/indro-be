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
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../framework/integrations/middleware");
const AdService_1 = require("../service/AdService");
const networkRoutes = express_1.default.Router();
// services
const adsService = new AdService_1.AdService();
// routes
networkRoutes.get("/feed/:lastPostId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.getFeed(res, parseInt(req.params.lastPostId, 10)); }));
networkRoutes.get("/my/:lastPostId", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.getMyAds(res, parseInt(req.params.lastPostId, 10)); }));
networkRoutes.get("/:postId", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.getAd(res, parseInt(req.params.postId, 10)); }));
networkRoutes.post("/feed", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.publishAd(res, req.body); }));
exports.default = networkRoutes;
//# sourceMappingURL=AdApi.js.map