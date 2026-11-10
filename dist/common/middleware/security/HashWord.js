"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareWord = exports.hashWord = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_service_1 = require("../../../config/env.service");
const hashWord = async (word) => {
    const hashedWord = await bcrypt_1.default.hash(String(word), Number(env_service_1.env.salt));
    return hashedWord;
};
exports.hashWord = hashWord;
const compareWord = async (word, hashedWord) => {
    const isMatch = await bcrypt_1.default.compare(String(word), hashedWord);
    return isMatch;
};
exports.compareWord = compareWord;
