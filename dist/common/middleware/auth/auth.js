"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.revokeToken = exports.auth = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_service_1 = require("../../../config/env.service");
const user_model_1 = require("../../../database/model/user.model");
const connenctionRedius_1 = require("../../../database/connenctionRedius");
const index_1 = require("../../index");
const SIGNATURES = {
    [index_1.UserRoleEnum.USER]: env_service_1.env.userSignature,
    [index_1.UserRoleEnum.ADMIN]: env_service_1.env.adminSignature,
};
const REFRESH_SIGNATURES = {
    [index_1.UserRoleEnum.USER]: env_service_1.env.userRefreshSignature,
    [index_1.UserRoleEnum.ADMIN]: env_service_1.env.adminRefreshSignature,
};
const generateToken = async (payload, role = index_1.UserRoleEnum.USER) => {
    const accessSignature = SIGNATURES[role];
    const refreshSignature = REFRESH_SIGNATURES[role];
    if (!accessSignature || !refreshSignature) {
        throw new Error("Invalid role or missing signature");
    }
    const accessToken = jsonwebtoken_1.default.sign(payload, accessSignature, {
        expiresIn: "1h",
        audience: String(role),
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, refreshSignature, {
        expiresIn: "1y",
        audience: String(role),
    });
    return {
        accessToken,
        refreshToken,
    };
};
exports.generateToken = generateToken;
const verifyAccessToken = async (token, role = index_1.UserRoleEnum.USER) => {
    const signature = SIGNATURES[role];
    if (!signature) {
        throw new Error("Invalid role or missing signature");
    }
    return jsonwebtoken_1.default.verify(token, signature);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = async (token, role = index_1.UserRoleEnum.USER) => {
    const signature = REFRESH_SIGNATURES[role];
    if (!signature) {
        throw new Error("Invalid role or missing signature");
    }
    return jsonwebtoken_1.default.verify(token, signature);
};
exports.verifyRefreshToken = verifyRefreshToken;
const auth = (role = index_1.UserRoleEnum.USER) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                throw new Error("Authorization header is required");
            }
            const [bearer, token] = authorization.split(" ");
            if (bearer !== "Bearer" || !token) {
                throw new Error("Invalid authorization format");
            }
            const isRevoked = await connenctionRedius_1.clientRedius.get(`BL:${token}`);
            if (isRevoked) {
                throw new Error("Token has been revoked");
            }
            const decoded = await (0, exports.verifyAccessToken)(token, role);
            const user = await user_model_1.userModel.findById(decoded.id);
            if (!user) {
                throw new Error("User not found");
            }
            req.user = user;
            req.token = token;
            next();
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : "Unauthorized",
            });
        }
    };
};
exports.auth = auth;
const revokeToken = async (token) => {
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded || typeof decoded === "string" || !decoded.exp) {
        throw new Error("Invalid token");
    }
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
        await connenctionRedius_1.clientRedius.set(`BL:${token}`, "revoked", {
            EX: ttl,
        });
    }
    return true;
};
exports.revokeToken = revokeToken;
const generateAccessToken = async (refreshToken) => {
    const decoded = jsonwebtoken_1.default.decode(refreshToken);
    if (!decoded || typeof decoded === "string" || decoded.aud === undefined) {
        throw new Error("Invalid refresh token");
    }
    const role = Number(decoded.aud);
    if (role !== index_1.UserRoleEnum.USER && role !== index_1.UserRoleEnum.ADMIN) {
        throw new Error("Invalid role");
    }
    const verified = await (0, exports.verifyRefreshToken)(refreshToken, role);
    const signature = SIGNATURES[role];
    if (!signature) {
        throw new Error("Missing access signature");
    }
    const accessToken = jsonwebtoken_1.default.sign({
        id: verified.id,
        email: verified.email,
    }, signature, {
        expiresIn: "1h",
        audience: String(role),
    });
    return {
        accessToken,
    };
};
exports.generateAccessToken = generateAccessToken;
