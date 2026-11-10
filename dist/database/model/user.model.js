"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../common/index");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    unique_name: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    phoneNumber: {
        type: String,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    gender: {
        type: Number,
        default: index_1.GenderEnum.MALE,
    },
    role: {
        type: Number,
        default: index_1.UserRoleEnum.USER,
    },
    provider: {
        type: Number,
        default: index_1.providerEnum.SYSTEM,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
});
userSchema
    .virtual("username")
    .set(function (value) {
    const [firstName, lastName] = value.trim().split(/\s+/);
    this.firstName = firstName || "";
    this.lastName = lastName || "";
})
    .get(function () {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});
exports.userModel = mongoose_1.default.model("User", userSchema);
