"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    firstName: zod_1.z
        .string({ error: "First name is required" })
        .min(2, "First name must be at least 2 characters")
        .max(100, "First name must be at most 100 characters"),
    unique_name: zod_1.z
        .string({ error: "Username is required" })
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters"),
    email: zod_1.z.string({ error: "Email is required" }).email("Invalid email format"),
    password: zod_1.z
        .string({ error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one uppercase letter, one number, and one special character (@$!%*?&)"),
    age: zod_1.z.coerce
        .number({ error: "Age is required and must be a number" })
        .min(18, "You must be at least 18 years old"),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.coerce.number().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string({ error: "Email is required" }).email("Invalid email format"),
    password: zod_1.z
        .string({ error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
});
