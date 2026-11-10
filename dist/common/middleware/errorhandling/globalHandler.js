"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const error_responce_1 = require("../../exception/error.responce");
const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof error_responce_1.ApplicationException) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            ...(err.data !== undefined ? { data: err.data } : {}),
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.globalErrorHandler = globalErrorHandler;
