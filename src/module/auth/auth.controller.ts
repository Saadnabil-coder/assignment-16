import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import authService from "./auth.service";
import { SuccessResponse } from "../../common/exception/success.responce";
import {
  loginRateLimit,
  sendOtpRateLimit,
} from "../../common/middleware/rateLimit/rateLimit";
import { auth } from "../../common/middleware/auth/auth";
import { validate } from "../../common/vaildation/vaildation";
import { loginSchema } from "./auth.validation";
import { upload } from "../../common/utils/multer/multer";
import { signupSchema } from "./auth.validation";
import { catchAsync } from "../../common/utils/catchAsync";

const authRouter = Router();

authRouter.post(
  "/login",
  loginRateLimit,
  validate(loginSchema),
  catchAsync(async (req: Request, res: Response) => {
    let loginAccount = await authService.login(req.body);
    SuccessResponse({
      res,
      message: "user login successflly",
      data: loginAccount,
    });
  }),
);

authRouter.post(
  "/signup",
  upload().single("profileImage"),
  validate(signupSchema),
  catchAsync(async (req: Request, res: Response) => {
    let data = await authService.signUp(req.body);
    SuccessResponse({
      res,
      message: "user added successflly",
      data: data,
    });
  }),
);

authRouter.post(
  "/verifyAccount",
  catchAsync(async (req: Request, res: Response) => {
    let userData = await authService.verifyUser(req.body);
    SuccessResponse({
      res,
      message: "user verify is successfully",
      data: userData,
    });
  }),
);

authRouter.post(
  "/resendOtp",
  sendOtpRateLimit,
  catchAsync(async (req: Request, res: Response) => {
    let userData = await authService.resendOtp(req.body);
    SuccessResponse({
      res,
      message: "user verify is successfully",
      data: userData,
    });
  }),
);

authRouter.post(
  "/logout",
  auth(),
  catchAsync(async (req: Request, res: Response) => {
    const result = await authService.logout(req);
    SuccessResponse({
      res,
      message: "logout successfully",
      data: result,
    });
  }),
);

export default authRouter;