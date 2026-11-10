"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerator = void 0;
const otpGenerator = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};
exports.otpGenerator = otpGenerator;
