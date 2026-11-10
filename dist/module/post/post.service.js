"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const error_responce_1 = require("../../common/exception/error.responce");
const postRepo_1 = require("./postRepo");
class PostService {
    postRepository;
    constructor() {
        this.postRepository = new postRepo_1.PostRepository();
    }
    async createPost(data, userId, image) {
        const post = {
            ...data,
            userId,
            ...(image ? { image } : {}),
        };
        return this.postRepository.create(post);
    }
    async getPosts() {
        return this.postRepository.findAll({ lean: true });
    }
    async getUserPosts(userId) {
        return this.postRepository.findAll({
            filter: { userId },
            lean: true,
        });
    }
    async updatePost(postId, data, userId, image) {
        const updateData = {
            ...data,
            ...(image ? { image } : {}),
        };
        const post = await this.postRepository.findOneAndUpdate({
            filter: { _id: postId, userId },
            data: updateData,
            lean: true,
        });
        if (!post) {
            throw new error_responce_1.NotFoundException("Post not found");
        }
        return post;
    }
    async deletePost(postId, userId) {
        const result = await this.postRepository.deleteOne({
            _id: postId,
            userId,
        });
        if (result.deletedCount === 0) {
            throw new error_responce_1.NotFoundException("Post not found");
        }
        return { deleted: true };
    }
}
exports.PostService = PostService;
