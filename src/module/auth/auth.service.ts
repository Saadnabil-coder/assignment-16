import { sendEmail } from "../../common/email/sendMail";

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../common/exception/error.responce";

import { generateToken, revokeToken } from "../../common/middleware/auth/auth";

import {
  compareWord,
  hashWord,
} from "../../common/middleware/security/HashWord";

import { otpGenerator } from "../../common/otp/otp";

import { clientRedius } from "../../database/connenctionRedius";

import { OAuth2Client } from "google-auth-library";

import { env } from "../../config/env.service";

import { IUser, providerEnum } from "../../common";

import { authRepository } from "./authRepo";
import { redisService } from "../../common/redis/redis.service";

class AuthService {
  private userRepository: authRepository;

  constructor() {
    this.userRepository = new authRepository();
  }

  async signUp(data: IUser) {
    console.log("SIGNUP DATA:", data);

    const {
      firstName,
      unique_name,
      email,
      password,
      phoneNumber,
      age,
      gender,
    } = data;

    if (!firstName || !unique_name || !email || !password) {
      throw new BadRequestException("Missing required fields");
    }
    const isUserExist = await this.userRepository.findOne({
      filter: {
        $or: [{ email }, ...(unique_name ? [{ unique_name }] : [])],
      },
    });

    if (isUserExist) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await hashWord(password);

    const user = await this.userRepository.create({
      firstName,
      lastName: "",
      email,
      password: hashedPassword,
      phoneNumber,
      age,
      unique_name,
      gender,
      confirmEmail: false,
    } as IUser);

    const otp = otpGenerator();
    const hashedOtp = await hashWord(String(otp));

    await redisService.setData(`otp:${email}`, hashedOtp,600);

    await sendEmail({
      to: email,
      subject: "Verify your account",
      text: `Hello ${firstName},

Your OTP is: ${otp}

This OTP will expire in 10 minutes.`,
      html: `Your OTP is <h2>${otp}</h2>`,
    });

    return {
      success: true,
      message: "Account created successfully. Please verify your email.",
      user,
    };
  }

  async login(data: any): Promise<any> {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestException("Please enter all data");
    }

 console.log("LOGIN EMAIL:", email);

 const user = await this.userRepository.findOne({
   filter: { email },
 })
 console.log("LOGIN EMAIL:", email);

 const allUsers = await this.userRepository.findAll({});

 console.log("ALL USERS:", allUsers);;

 console.log("FOUND USER:", user);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordMatch = await compareWord(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException("Incorrect password");
    }

    if (!user.confirmEmail) {
      throw new BadRequestException("User not verified");
    }

    const tokens = await generateToken(
      {
        id: user._id.toString(),
        email: user.email,
      },
      user.role,
    );

    return {
      success: true,
      message: "Login success",
      ...tokens,
      user,
    };
  }

  async verifyUser(data: any) {
    const { email, otp } = data;

    if (!email || !otp) {
      throw new BadRequestException("Please enter all data");
    }

    const user = await this.userRepository.findOne({
      filter: { email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const storedOtp = await redisService.getData(`otp:${email}`);

    if (!storedOtp) {
      throw new BadRequestException("OTP has expired or is invalid");
    }

    const isOtpMatch = await compareWord(String(otp),storedOtp);

    if (!isOtpMatch) {
      throw new BadRequestException("Invalid OTP");
    }

    await this.userRepository.findOneAndUpdate({
      filter: { email },
      data: { confirmEmail: true },
    });

    await clientRedius.del(`otp:${email}`);

    return {
      success: true,
      message: "Account verified successfully",
    };
  }

  async resendOtp(data: any) {
    const { email } = data;

    if (!email) {
      throw new BadRequestException("Email is required");
    }

    const user = await this.userRepository.findOne({
      filter: { email },
    });

    if (!user) {
      throw new NotFoundException("Account does not exist");
    }

    if (user.confirmEmail) {
      throw new BadRequestException("Account already verified");
    }

    const otp = otpGenerator();

    const hashedOtp = await hashWord(String(otp));

    await clientRedius.set(`otp:${email}`, hashedOtp, {
      EX: 600,
    });

    await sendEmail({
      to: email,
      subject: "Verify your account",
      text: `Your OTP is: ${otp}

This OTP will expire in 10 minutes.`,
      html: `Your OTP is <h2>${otp}</h2>`,
    });

    return {
      success: true,
      message: "OTP resent successfully",
    };
  }

  async signupMail(body: any) {
    if (!env.googleClientId) {
      throw new BadRequestException("GOOGLE_CLIENT_ID is not defined");
    }

    if (!body.idToken) {
      throw new BadRequestException("Google ID token is required");
    }

    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: body.idToken,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new BadRequestException("Invalid Google token");
    }

    if (!payload.email_verified) {
      throw new BadRequestException("Email not verified");
    }

    const { email, name } = payload;

    if (!email) {
      throw new BadRequestException("Google account email not found");
    }

    const existUser = await this.userRepository.findOne({
      filter: { email },
    });

    if (existUser) {
      throw new ConflictException("User already exists");
    }

    const firstName = name?.split(" ")[0] || "Google";

    const lastName = name?.split(" ").slice(1).join(" ") || "";

    const unique_name =
      email.split("@")[0] + "_" + Math.floor(Math.random() * 10000);

    const addUser = await this.userRepository.create({
      firstName,
      lastName,
      unique_name,
      email,
      password: "",
      provider: providerEnum.GOOGLE,
      confirmEmail: true,
    } as IUser);

    return {
      success: true,
      message: "Google signup successful",
      user: addUser,
    };
  }

  async logout(req: any): Promise<any> {
    await revokeToken(req.token);

    return {
      success: true,
      message: "Logout successfully",
    };
  }
}

export default new AuthService();
