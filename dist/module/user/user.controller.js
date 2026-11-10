"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const success_responce_1 = require("../../common/exception/success.responce");
const auth_js_1 = require("../../common/middleware/auth/auth.js");
const multer_js_1 = require("../../common/utils/multer/multer.js");
const router = (0, express_1.Router)();
router.get("/profile", (0, auth_js_1.auth)(), async (req, res) => {
    if (!req.user) {
        throw new Error("User not found");
    }
    const user = await user_service_1.default.getData(req.user.id);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "Your Data",
        data: user,
    });
});
router.put("/UpDateUserProfile", (0, auth_js_1.auth)(), (0, multer_js_1.upload)().single("profileImage"), async (req, res) => {
    if (!req.user) {
        throw new Error("User not found");
    }
    const user = await user_service_1.default.updateData(req.user.id, req.body, req.files);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "Your Data Updated",
        data: user,
    });
});
exports.default = router;
