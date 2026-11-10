"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, `../../${process.env.NODE_ENV}.env`) });
const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV || "dev";
const salt = process.env.SALT;
const adminSignature = process.env.ADMIN_SIGNATURE;
const userSignature = process.env.USER_SIGNATURE;
const adminRefreshSignature = process.env.ADMIN_REFRESH_SIGNATURE;
const userRefreshSignature = process.env.USER_REFRESH_SIGNATURE;
const googleAccount = process.env.GOOGLE_ACCOUNT;
const passwordAccount = process.env.PASSWORD_ACCOUNT;
const databaseUrl = process.env.Database_URL;
const serverUrl = process.env.SERVER_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const iterations = process.env.ITERATIONS;
const redisConnection = process.env.REDIS_CONNECTION;
const awsRegion = process.env.AWS_REGION;
const awsBucketName = process.env.AWS_BUCKET_NAME;
exports.env = {
    port,
    nodeEnv,
    salt,
    adminSignature,
    userSignature,
    adminRefreshSignature,
    userRefreshSignature,
    googleAccount,
    passwordAccount,
    databaseUrl,
    serverUrl,
    googleClientId,
    jwtSecret,
    jwtExpiresIn,
    iterations,
    redisConnection,
    awsRegion,
    awsBucketName,
};
