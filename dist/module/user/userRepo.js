"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../../database/model/user.model");
const database_resposatery_1 = require("../../common/reposatery/database.resposatery");
class UserRepository extends database_resposatery_1.DatabaseRepository {
    constructor() {
        super(user_model_1.userModel);
    }
}
exports.UserRepository = UserRepository;
