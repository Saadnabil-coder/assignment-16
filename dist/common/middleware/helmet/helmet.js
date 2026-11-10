"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permitionPolicy = exports.referrerPolicy = exports.hsts = exports.frameguard = exports.xssFilter = exports.onSniff = exports.crossOriginOpenerPolicy = exports.crossOriginEmbedderPolicy = exports.contentSecurityPolicy = void 0;
const helmet_1 = __importDefault(require("helmet"));
exports.contentSecurityPolicy = helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    },
});
exports.crossOriginEmbedderPolicy = helmet_1.default.crossOriginEmbedderPolicy({
    policy: "require-corp",
});
exports.crossOriginOpenerPolicy = helmet_1.default.crossOriginOpenerPolicy({
    policy: "same-origin",
});
exports.onSniff = helmet_1.default.noSniff();
exports.xssFilter = helmet_1.default.xssFilter();
exports.frameguard = helmet_1.default.frameguard({
    action: "deny",
});
exports.hsts = helmet_1.default.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
});
exports.referrerPolicy = helmet_1.default.referrerPolicy({
    policy: "no-referrer",
});
exports.permitionPolicy = helmet_1.default.permittedCrossDomainPolicies({
    permittedPolicies: "none",
});
