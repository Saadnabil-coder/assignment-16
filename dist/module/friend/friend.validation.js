"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendValidation = void 0;
const zod_1 = require("zod");
const friend_enum_1 = require("../../common/enum/friend.enum");
exports.friendValidation = zod_1.z
    .object({
    userId: zod_1.z.string().min(1, { message: "userId is required" }),
    friendId: zod_1.z.string().min(1, { message: "friendId is required" }),
    status: zod_1.z.nativeEnum(friend_enum_1.FriendStatus, {
        error: "status must be a valid FriendStatus",
    }),
})
    .refine((data) => data.userId !== data.friendId, {
    message: "friendId must not be equal to userId",
    path: ["friendId"],
});
