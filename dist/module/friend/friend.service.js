"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendservice = void 0;
const friendRepo_1 = require("./friendRepo");
const friend_enum_1 = require("../../common/enum/friend.enum");
class friendservice {
    FriendRepository;
    constructor() {
        this.FriendRepository = new friendRepo_1.FriendRepository();
    }
    async sendFriendRequest(data) {
        const existing = await this.FriendRepository.findExists({
            userId: data.userId,
            friendId: data.friendId
        });
        if (existing) {
            throw new Error("Friend request already exists between these users");
        }
        return this.FriendRepository.create({
            ...data,
            status: friend_enum_1.FriendStatus.PENDING,
        });
    }
    async acceptFriendRequest(data) {
        const existing = await this.FriendRepository.findOne({
            filter: {
                userId: data.friendId,
                friendId: data.userId,
                status: friend_enum_1.FriendStatus.PENDING,
            },
        });
        if (!existing) {
            throw new Error("No pending friend request found");
        }
        return this.FriendRepository.updateOne({
            filter: { _id: existing._id },
            data: { status: friend_enum_1.FriendStatus.ACCEPTED },
        });
    }
    async rejectFriendRequest(data) {
        const existing = await this.FriendRepository.findOne({
            filter: {
                userId: data.friendId,
                friendId: data.userId,
                status: friend_enum_1.FriendStatus.PENDING,
            },
        });
        if (!existing) {
            throw new Error("No pending friend request found");
        }
        return this.FriendRepository.updateOne({
            filter: { _id: existing._id },
            data: { status: friend_enum_1.FriendStatus.REJECTED },
        });
    }
    async getFriends(userId) {
        const friends = await this.FriendRepository.findAll({
            filter: {
                $or: [
                    { userId, status: friend_enum_1.FriendStatus.ACCEPTED },
                    { friendId: userId, status: friend_enum_1.FriendStatus.ACCEPTED },
                ],
            },
        });
    }
    async friendList(userId) {
        const friends = await this.FriendRepository.findAll({
            filter: {
                $or: [
                    { userId, status: friend_enum_1.FriendStatus.ACCEPTED },
                    { friendId: userId, status: friend_enum_1.FriendStatus.ACCEPTED },
                ],
            },
        });
        return friends;
    }
    async getFriendRequests(userId) {
        const requests = await this.FriendRepository.findAll({
            filter: {
                friendId: userId,
                status: friend_enum_1.FriendStatus.PENDING,
            },
        });
        return requests;
    }
    async blockUser(data) {
        const existing = await this.FriendRepository.findOne({
            filter: {
                $or: [
                    { userId: data.userId, friendId: data.friendId },
                    { userId: data.friendId, friendId: data.userId },
                ],
            },
        });
    }
    async cancelFriendRequest(data) {
        const existing = await this.FriendRepository.findOne({
            filter: {
                userId: data.userId,
                friendId: data.friendId,
                status: friend_enum_1.FriendStatus.PENDING,
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
exports.friendservice = friendservice;
