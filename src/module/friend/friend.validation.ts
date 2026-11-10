import { z } from "zod";
import { FriendStatus } from "../../common/enum/friend.enum";

export const friendValidation = z
  .object({
    userId: z.string().min(1, { message: "userId is required" }),
    friendId: z.string().min(1, { message: "friendId is required" }),
    status: z.nativeEnum(FriendStatus, {
      error: "status must be a valid FriendStatus",
    }),
  })
  .refine((data) => data.userId !== data.friendId, {
    message: "friendId must not be equal to userId",
    path: ["friendId"],
  });


  export type FriendValidation = z.infer<typeof friendValidation>;
  