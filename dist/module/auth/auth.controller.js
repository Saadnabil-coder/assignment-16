"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const success_responce_1 = require("../../common/exception/success.responce");
const rateLimit_1 = require("../../common/middleware/rateLimit/rateLimit");
const auth_1 = require("../../common/middleware/auth/auth");
const vaildation_1 = require("../../common/vaildation/vaildation");
const auth_validation_1 = require("./auth.validation");
const multer_1 = require("../../common/utils/multer/multer");
const auth_validation_2 = require("./auth.validation");
const catchAsync_1 = require("../../common/utils/catchAsync");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", rateLimit_1.loginRateLimit, (0, vaildation_1.validate)(auth_validation_1.loginSchema), (0, catchAsync_1.catchAsync)(async (req, res) => {
    let loginAccount = await auth_service_1.default.login(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "user login successflly",
        data: loginAccount,
    });
}));
authRouter.post("/signup", (0, multer_1.upload)().single("profileImage"), (0, vaildation_1.validate)(auth_validation_2.signupSchema), (0, catchAsync_1.catchAsync)(async (req, res) => {
    let data = await auth_service_1.default.signUp(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "user added successflly",
        data: data,
    });
}));
authRouter.post("/verifyAccount", (0, catchAsync_1.catchAsync)(async (req, res) => {
    let userData = await auth_service_1.default.verifyUser(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "user verify is successfully",
        data: userData,
    });
}));
authRouter.post("/resendOtp", rateLimit_1.sendOtpRateLimit, (0, catchAsync_1.catchAsync)(async (req, res) => {
    let userData = await auth_service_1.default.resendOtp(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "user verify is successfully",
        data: userData,
    });
}));
authRouter.post("/logout", (0, auth_1.auth)(), (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.default.logout(req);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "logout successfully",
        data: result,
    });
}));
exports.default = authRouter;
