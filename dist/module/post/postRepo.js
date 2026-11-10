"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const database_resposatery_1 = require("../../common/reposatery/database.resposatery");
const post_model_1 = require("../../database/model/post.model");
class PostRepository extends database_resposatery_1.DatabaseRepository {
    constructor() {
        super(post_model_1.postModel);
    }
}
exports.PostRepository = PostRepository;
