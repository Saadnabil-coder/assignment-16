import { Router, Request, Response } from "express";
import {friendservice} from "./friend.service";
import { SuccessResponse } from "../../common/exception/success.responce";
import { auth } from "../../common/middleware/auth/auth.js";
import { upload } from "../../common/utils/multer/multer.js";
import { validate } from "../../common/vaildation/vaildation";
import { friendValidation } from "./friend.validation";

const router = Router();

router.post("/sendFriendRequest",validate(friendValidation),auth(), async (req: Request, res: Response) => {
  const friendService = new friendservice();
  await friendService.sendFriendRequest(req.body);
 SuccessResponse({
   res,
   message: "user login successflly",
   data: friendService,
 });

})


router.post("/acceptFriendRequest",validate(friendValidation),auth(), async (req: Request, res: Response) => {
  const friendService = new friendservice();
  await friendService.acceptFriendRequest(req.body);
  SuccessResponse({
    res,
    message: "Friend request accepted successfully",
    data: friendService,
  });
}
)

router.post("/rejectFriendRequest",validate(friendValidation),auth(), async (req: Request, res: Response) => {
  const friendService = new friendservice();
  await friendService.rejectFriendRequest(req.body);
  SuccessResponse({
    res,
    message: "Friend request rejected successfully",
    data: friendService,
  });
}
)

router.get("/getFriends",auth(), async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const friendService = new friendservice();
  const friends = await friendService.getFriends(req.user.id);
  SuccessResponse({
    res,
    message: "Friends retrieved successfully",
    data: friends,
  });  

})

router.get("/getFriendRequests",auth(), async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const friendService = new friendservice();
  const requests = await friendService.getFriendRequests(req.user.id);
  SuccessResponse({
    res,
    message: "Friend requests retrieved successfully",
    data: requests,
  });
});

router.post("/blockUser",validate(friendValidation),auth(), async (req: Request, res: Response) => {
  const friendService = new friendservice();
  await friendService.blockUser(req.body);
  SuccessResponse({
    res,
    message: "User blocked successfully",
    data: friendService,
  });
})


export default router;