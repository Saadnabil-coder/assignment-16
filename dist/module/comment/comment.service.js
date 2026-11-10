"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const error_responce_1 = require("../../common/exception/error.responce");
const commentRepo_1 = require("./commentRepo");
class CommentService {
    commentRepository;
    constructor() {
        this.commentRepository = new commentRepo_1.CommentRepository();
    }
    async createComment(data, userId) {
        return this.commentRepository.create({
            ...data,
            userId,
        });
    }
    async getComments(postId) {
        return this.commentRepository.findAll({
            filter: { postId },
            lean: true,
        }).then((comments) => comments.sort((first, second) => {
            const firstDate = first.createdAt?.getTime() ?? 0;
            const secondDate = second.createdAt?.getTime() ?? 0;
            return firstDate - secondDate;
        }));
    }
    async updateComment(commentId, data, userId) {
        const comment = await this.commentRepository.findOneAndUpdate({
            filter: { _id: commentId, userId },
            data,
            lean: true,
        });
        if (!comment) {
            throw new error_responce_1.NotFoundException("Comment not found");
        }
        return comment;
    }
    async deleteComment(commentId, userId) {
        const result = await this.commentRepository.deleteOne({
            _id: commentId,
            userId,
        });
        if (result.deletedCount === 0) {
            throw new error_responce_1.NotFoundException("Comment not found");
        }
        return { deleted: true };
    }
}
exports.CommentService = CommentService;
