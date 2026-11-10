import { NotFoundException } from "../../common/exception/error.responce";
import { IComment } from "../../common/interfaces/comment.interface";
import { CommentRepository } from "./commentRepo";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "./comment.validation";

export class CommentService {
  private readonly commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(data: CreateCommentInput, userId: string) {
    return this.commentRepository.create({
      ...data,
      userId,
    });
  }

  async getComments(postId: string) {
    return this.commentRepository.findAll({
      filter: { postId },
      lean: true,
    }).then((comments: IComment[]) =>
      comments.sort((first: IComment, second: IComment) => {
        const firstDate = first.createdAt?.getTime() ?? 0;
        const secondDate = second.createdAt?.getTime() ?? 0;
        return firstDate - secondDate;
      }),
    );
  }

  async updateComment(
    commentId: string,
    data: UpdateCommentInput,
    userId: string,
  ) {
    const comment = await this.commentRepository.findOneAndUpdate({
      filter: { _id: commentId, userId },
      data,
      lean: true,
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return comment;
  }

  async deleteComment(commentId: string, userId: string) {
    const result = await this.commentRepository.deleteOne({
      _id: commentId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException("Comment not found");
    }

    return { deleted: true };
  }
}