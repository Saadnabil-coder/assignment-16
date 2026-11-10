import { Router, Request, Response } from "express";
import UserService from "./user.service";
import { SuccessResponse } from "../../common/exception/success.responce";
import { auth } from "../../common/middleware/auth/auth.js";
import { upload } from "../../common/utils/multer/multer.js";

const router = Router();

router.get("/profile", auth(), async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error("User not found");
  }

  const user = await UserService.getData(req.user.id);

  SuccessResponse({
    res,
    message: "Your Data",
    data: user,
  });
});

router.put(
  "/UpDateUserProfile",
  auth(),
  upload().single("profileImage"),
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }

    const user = await UserService.updateData(
      req.user.id,
      req.body,
      req.files as Express.Multer.File[],
    );

    SuccessResponse({
      res,
      message: "Your Data Updated",
      data: user,
    });
  },
);

export default router;