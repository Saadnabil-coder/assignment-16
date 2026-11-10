import {FriendRepository} from"./friendRepo"
import { IFriend } from "../../common/interfaces/friend.interface";
import { FriendStatus } from "../../common/enum/friend.enum";
import { Types } from "mongoose";
export class friendservice {
  private FriendRepository: FriendRepository;

  constructor() {
    this.FriendRepository = new FriendRepository();
  }
async sendFriendRequest(data:IFriend){
    const existing = await this.FriendRepository.findExists({
      userId: data.userId,
      friendId: data.friendId
    });

    if (existing) {
      throw new Error("Friend request already exists between these users");
    }

    return this.FriendRepository.create({
      ...data,
      status: FriendStatus.PENDING,
    });
  }

  async acceptFriendRequest(data: IFriend) {
    const existing = await this.FriendRepository.findOne({
      filter: {
        userId: data.friendId,
        friendId: data.userId,
        status: FriendStatus.PENDING,
      },
    });
    if (!existing) {
      throw new Error("No pending friend request found");
    }
    return this.FriendRepository.updateOne({
      filter: { _id: existing._id },
      data: { status: FriendStatus.ACCEPTED },
    });
    

  }

  async rejectFriendRequest(data: IFriend) {
    const existing = await this.FriendRepository.findOne({
      filter: {
        userId: data.friendId,
        friendId: data.userId,
        status: FriendStatus.PENDING,
      },
    });
    if (!existing) {
      throw new Error("No pending friend request found");
    }
    return this.FriendRepository.updateOne({
      filter: { _id: existing._id },
      data: { status: FriendStatus.REJECTED },
    });
  }

  async getFriends(userId: string) {
    const friends = await this.FriendRepository.findAll({
      filter: {
        $or: [
          { userId, status: FriendStatus.ACCEPTED },
          { friendId: userId, status: FriendStatus.ACCEPTED },
        ],
      },
    });


  }


  async friendList(userId: string | Types.ObjectId) {

    const friends = await this.FriendRepository.findAll({
      filter: {
        $or: [
          { userId, status: FriendStatus.ACCEPTED },
          { friendId: userId, status: FriendStatus.ACCEPTED },
        ],
      },
    });

    return friends;
  }

  async getFriendRequests(userId: string) {
    const requests = await this.FriendRepository.findAll({
      filter: {
        friendId: userId,
        status: FriendStatus.PENDING,
      },
    });

    return requests;
  }


  async blockUser(data: IFriend) {
    const existing = await this.FriendRepository.findOne({
      filter: {
        $or: [
          { userId: data.userId, friendId: data.friendId },
          { userId: data.friendId, friendId: data.userId },
        ],
      },
    });

  }


  async cancelFriendRequest(data: IFriend) {
    const existing = await this.FriendRepository.findOne({
      filter: {
        userId: data.userId,
        friendId: data.friendId,
        status: FriendStatus.PENDING,
      },
    });
    if (!existing) {
      throw new Error("No pending friend request found");
    }
    return this.FriendRepository.deleteOne({
      filter: { _id: existing._id },
    });
  }
  

}