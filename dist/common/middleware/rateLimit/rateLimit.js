"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalRateLimit = exports.sendOtpRateLimit = exports.loginRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 1 minute.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.sendOtpRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: "Too many OTP requests. Please try again after 1 minute.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.generalRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 10
});
