"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRS = exports.clientRedius = void 0;
const redis_1 = require("redis");
const env_service_1 = require("../config/env.service");
exports.clientRedius = (0, redis_1.createClient)({
    url: env_service_1.env.redisConnection,
});
const connectRS = async () => {
    try {
        await exports.clientRedius.connect();
        console.log("Connected to redis");
    }
    catch (error) {
        console.error("Error connecting to redis", error);
    }
};
exports.connectRS = connectRS;
