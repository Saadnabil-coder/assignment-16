"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const database_resposatery_1 = require("../../common/reposatery/database.resposatery");
const comment_model_1 = require("../../database/model/comment.model");
class CommentRepository extends database_resposatery_1.DatabaseRepository {
    constructor() {
        super(comment_model_1.commentModel);
    }
}
exports.CommentRepository = CommentRepository;
