"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_service_1 = require("../../config/env.service");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_service_1.env.googleAccount,
        pass: env_service_1.env.passwordAccount,
    },
});
const sendEmail = async ({ to, subject, html, text, }) => {
    const info = await transporter.sendMail({
        from: `"Social Media App" <${env_service_1.env.googleAccount}>`,
        to,
        subject,
        text,
        html,
    });
    return info;
};
exports.sendEmail = sendEmail;
