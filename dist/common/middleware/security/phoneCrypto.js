"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptWord = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_service_1 = require("../../../config/env.service");
const EncryptWord = async (word) => {
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    const hashedWord = await new Promise((resolve, reject) => {
        crypto_1.default.pbkdf2(String(word), salt, Number(env_service_1.env.iterations), 64, "sha512", (err, derivedKey) => {
            if (err)
                return reject(err);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
    return hashedWord;
};
exports.EncryptWord = EncryptWord;
