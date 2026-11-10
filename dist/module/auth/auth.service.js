"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendMail_1 = require("../../common/email/sendMail");
const error_responce_1 = require("../../common/exception/error.responce");
const auth_1 = require("../../common/middleware/auth/auth");
const HashWord_1 = require("../../common/middleware/security/HashWord");
const otp_1 = require("../../common/otp/otp");
const connenctionRedius_1 = require("../../database/connenctionRedius");
const google_auth_library_1 = require("google-auth-library");
const env_service_1 = require("../../config/env.service");
const common_1 = require("../../common");
const authRepo_1 = require("./authRepo");
const redis_service_1 = require("../../common/redis/redis.service");
class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new authRepo_1.authRepository();
    }
    async signUp(data) {
        console.log("SIGNUP DATA:", data);
        const { firstName, unique_name, email, password, phoneNumber, age, gender, } = data;
        if (!firstName || !unique_name || !email || !password) {
            throw new error_responce_1.BadRequestException("Missing required fields");
        }
        const isUserExist = await this.userRepository.findOne({
            filter: {
                $or: [{ email }, ...(unique_name ? [{ unique_name }] : [])],
            },
        });
        if (isUserExist) {
            throw new error_responce_1.ConflictException("User already exists");
        }
        const hashedPassword = await (0, HashWord_1.hashWord)(password);
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
        });
        const otp = (0, otp_1.otpGenerator)();
        const hashedOtp = await (0, HashWord_1.hashWord)(String(otp));
        await redis_service_1.redisService.setData(`otp:${email}`, hashedOtp, 600);
        await (0, sendMail_1.sendEmail)({
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
    async login(data) {
        const { email, password } = data;
        if (!email || !password) {
            throw new error_responce_1.BadRequestException("Please enter all data");
        }
        console.log("LOGIN EMAIL:", email);
        const user = await this.userRepository.findOne({
            filter: { email },
        });
        console.log("LOGIN EMAIL:", email);
        const allUsers = await this.userRepository.findAll({});
        console.log("ALL USERS:", allUsers);
        ;
        console.log("FOUND USER:", user);
        if (!user) {
            throw new error_responce_1.NotFoundException("User not found");
        }
        const isPasswordMatch = await (0, HashWord_1.compareWord)(password, user.password);
        if (!isPasswordMatch) {
            throw new error_responce_1.BadRequestException("Incorrect password");
        }
        if (!user.confirmEmail) {
            throw new error_responce_1.BadRequestException("User not verified");
        }
        const tokens = await (0, auth_1.generateToken)({
            id: user._id.toString(),
            email: user.email,
        }, user.role);
        return {
            success: true,
            message: "Login success",
            ...tokens,
            user,
        };
    }
    async verifyUser(data) {
        const { email, otp } = data;
        if (!email || !otp) {
            throw new error_responce_1.BadRequestException("Please enter all data");
        }
        const user = await this.userRepository.findOne({
            filter: { email },
        });
        if (!user) {
            throw new error_responce_1.NotFoundException("User not found");
        }
        const storedOtp = await redis_service_1.redisService.getData(`otp:${email}`);
        if (!storedOtp) {
            throw new error_responce_1.BadRequestException("OTP has expired or is invalid");
        }
        const isOtpMatch = await (0, HashWord_1.compareWord)(String(otp), storedOtp);
        if (!isOtpMatch) {
            throw new error_responce_1.BadRequestException("Invalid OTP");
        }
        await this.userRepository.findOneAndUpdate({
            filter: { email },
            data: { confirmEmail: true },
        });
        await connenctionRedius_1.clientRedius.del(`otp:${email}`);
        return {
            success: true,
            message: "Account verified successfully",
        };
    }
    async resendOtp(data) {
        const { email } = data;
        if (!email) {
            throw new error_responce_1.BadRequestException("Email is required");
        }
        const user = await this.userRepository.findOne({
            filter: { email },
        });
        if (!user) {
            throw new error_responce_1.NotFoundException("Account does not exist");
        }
        if (user.confirmEmail) {
            throw new error_responce_1.BadRequestException("Account already verified");
        }
        const otp = (0, otp_1.otpGenerator)();
        const hashedOtp = await (0, HashWord_1.hashWord)(String(otp));
        await connenctionRedius_1.clientRedius.set(`otp:${email}`, hashedOtp, {
            EX: 600,
        });
        await (0, sendMail_1.sendEmail)({
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
    async signupMail(body) {
        if (!env_service_1.env.googleClientId) {
            throw new error_responce_1.BadRequestException("GOOGLE_CLIENT_ID is not defined");
        }
        if (!body.idToken) {
            throw new error_responce_1.BadRequestException("Google ID token is required");
        }
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: body.idToken,
            audience: env_service_1.env.googleClientId,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new error_responce_1.BadRequestException("Invalid Google token");
        }
        if (!payload.email_verified) {
            throw new error_responce_1.BadRequestException("Email not verified");
        }
        const { email, name } = payload;
        if (!email) {
            throw new error_responce_1.BadRequestException("Google account email not found");
        }
        const existUser = await this.userRepository.findOne({
            filter: { email },
        });
        if (existUser) {
            throw new error_responce_1.ConflictException("User already exists");
        }
        const firstName = name?.split(" ")[0] || "Google";
        const lastName = name?.split(" ").slice(1).join(" ") || "";
        const unique_name = email.split("@")[0] + "_" + Math.floor(Math.random() * 10000);
        const addUser = await this.userRepository.create({
            firstName,
            lastName,
            unique_name,
            email,
            password: "",
            provider: common_1.providerEnum.GOOGLE,
            confirmEmail: true,
        });
        return {
            success: true,
            message: "Google signup successful",
            user: addUser,
        };
    }
    async logout(req) {
        await (0, auth_1.revokeToken)(req.token);
        return {
            success: true,
            message: "Logout successfully",
        };
    }
}
exports.default = new AuthService();
