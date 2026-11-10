"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const error_responce_1 = require("../exception/error.responce");
const validate = (Schema) => {
    return (req, res, next) => {
        const result = Schema.safeParse(req.body);
        console.log(result.error);
        if (!result.success) {
            throw new error_responce_1.BadRequestException("Validation Error", result.error.issues.map((err) => err.message));
        }
        req.body = result.data;
        next();
    };
};
exports.validate = validate;
