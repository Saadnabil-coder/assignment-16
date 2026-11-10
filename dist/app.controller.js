"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const rateLimit_1 = require("./common/middleware/rateLimit/rateLimit");
const env_service_1 = require("./config/env.service");
const connectionMongo_1 = require("./database/connectionMongo");
const connenctionRedius_1 = require("./database/connenctionRedius");
const globalHandler_1 = require("./common/middleware/errorhandling/globalHandler");
const user_controller_1 = __importDefault(require("./module/user/user.controller"));
const friend_controller_1 = __importDefault(require("./module/friend/friend.controller"));
const comment_controller_1 = __importDefault(require("./module/comment/comment.controller"));
const post_controller_1 = __importDefault(require("./module/post/post.controller"));
const bootstrap = async () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:4200"
    }));
    app.use(rateLimit_1.generalRateLimit);
    app.use((0, helmet_1.default)());
    await (0, connectionMongo_1.connectDB)();
    await (0, connenctionRedius_1.connectRS)();
    app.use(express_1.default.json());
    app.use("/auth", auth_controller_1.default);
    app.use("/user", user_controller_1.default);
    app.use("/friend", friend_controller_1.default);
    app.use("/comment", comment_controller_1.default);
    app.use("/post", post_controller_1.default);
    app.use((req, res) => {
        res.status(404).json({ success: false, message: "Route not found" });
    });
    app.use(globalHandler_1.globalErrorHandler);
    app.listen(env_service_1.env.port, () => {
        console.log("server is running");
    });
};
exports.default = bootstrap;
