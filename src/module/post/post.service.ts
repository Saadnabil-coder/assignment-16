import { NotFoundException } from "../../common/exception/error.responce";
import { IPost } from "../../common/interfaces/post.interface";
import { PostRepository } from "./postRepo";
import { CreatePostInput, UpdatePostInput } from "./post.validation";

export class PostService {
  private readonly postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async createPost(
    data: CreatePostInput,
    userId: string,
    image?: string,
  ) {
    const post: IPost = {
      ...data,
      userId,
      ...(image ? { image } : {}),
    };

    return this.postRepository.create(post);
  }

  async getPosts() {
    return this.postRepository.findAll({ lean: true });
  }

  async getUserPosts(userId: string) {
    return this.postRepository.findAll({
      filter: { userId },
      lean: true,
    });
  }

  async updatePost(
    postId: string,
    data: UpdatePostInput,
    userId: string,
    image?: string,
  ) {
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
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async deletePost(postId: string, userId: string) {
    const result = await this.postRepository.deleteOne({
      _id: postId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException("Post not found");
    }

    return { deleted: true };
  }
}