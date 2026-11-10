"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentValidation = exports.createCommentValidation = void 0;
const zod_1 = require("zod");
exports.createCommentValidation = zod_1.z.object({
    postId: zod_1.z.string().trim().min(1, { message: "postId is required" }),
    content: zod_1.z
        .string()
        .trim()
        .min(1, { message: "content is required" })
        .max(2000, { message: "content must not exceed 2000 characters" }),
});
exports.updateCommentValidation = zod_1.z.object({
    content: zod_1.z
        .string()
        .trim()
        .min(1, { message: "content is required" })
        .max(2000, { message: "content must not exceed 2000 characters" }),
});
