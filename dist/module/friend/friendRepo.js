"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRepository = void 0;
const friend_model_1 = require("../../database/model/friend.model");
const database_resposatery_1 = require("../../common/reposatery/database.resposatery");
class FriendRepository extends database_resposatery_1.DatabaseRepository {
    constructor() {
        super(friend_model_1.friendModel);
    }
}
exports.FriendRepository = FriendRepository;
