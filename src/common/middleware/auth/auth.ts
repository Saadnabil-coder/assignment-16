import jwt from "jsonwebtoken";
import { env } from "../../../config/env.service";
import { userModel } from "../../../database/model/user.model";
import { clientRedius } from "../../../database/connenctionRedius";
import { NextFunction, Request, Response } from "express";
import { UserRoleEnum, IUser } from "../../index";
type Role = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

interface ITokenPayload {
  id: string;
  email: string;
}

const SIGNATURES: Record<Role, string | undefined> = {
  [UserRoleEnum.USER]: env.userSignature,
  [UserRoleEnum.ADMIN]: env.adminSignature,
};

const REFRESH_SIGNATURES: Record<Role, string | undefined> = {
  [UserRoleEnum.USER]: env.userRefreshSignature,
  [UserRoleEnum.ADMIN]: env.adminRefreshSignature,
};

export const generateToken = async (
  payload: ITokenPayload,
  role: Role = UserRoleEnum.USER,
) => {
  const accessSignature = SIGNATURES[role];
  const refreshSignature = REFRESH_SIGNATURES[role];

  if (!accessSignature || !refreshSignature) {
    throw new Error("Invalid role or missing signature");
  }

  const accessToken = jwt.sign(payload, accessSignature, {
    expiresIn: "1h",
    audience: String(role),
  });

  const refreshToken = jwt.sign(payload, refreshSignature, {
    expiresIn: "1y",
    audience: String(role),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyAccessToken = async (
  token: string,
  role: Role = UserRoleEnum.USER,
) => {
  const signature = SIGNATURES[role];

  if (!signature) {
    throw new Error("Invalid role or missing signature");
  }

  return jwt.verify(token, signature) as jwt.JwtPayload & ITokenPayload;
};

export const verifyRefreshToken = async (
  token: string,
  role: Role = UserRoleEnum.USER,
) => {
  const signature = REFRESH_SIGNATURES[role];

  if (!signature) {
    throw new Error("Invalid role or missing signature");
  }

  return jwt.verify(token, signature) as jwt.JwtPayload & ITokenPayload;
};

export const auth = (role: Role = UserRoleEnum.USER) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new Error("Authorization header is required");
      }

      const [bearer, token] = authorization.split(" ");

      if (bearer !== "Bearer" || !token) {
        throw new Error("Invalid authorization format");
      }

      const isRevoked = await clientRedius.get(`BL:${token}`);

      if (isRevoked) {
        throw new Error("Token has been revoked");
      }

      const decoded = await verifyAccessToken(token, role);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Unauthorized",
      });
    }
  };
};

export const revokeToken = async (token: string) => {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === "string" || !decoded.exp) {
    throw new Error("Invalid token");
  }

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);

  if (ttl > 0) {
    await clientRedius.set(`BL:${token}`, "revoked", {
      EX: ttl,
    });
  }

  return true;
};

export const generateAccessToken = async (refreshToken: string) => {
  const decoded = jwt.decode(refreshToken);

  if (!decoded || typeof decoded === "string" || decoded.aud === undefined) {
    throw new Error("Invalid refresh token");
  }

  const role = Number(decoded.aud) as Role;

  if (role !== UserRoleEnum.USER && role !== UserRoleEnum.ADMIN) {
    throw new Error("Invalid role");
  }

  const verified = await verifyRefreshToken(refreshToken, role);

  const signature = SIGNATURES[role];

  if (!signature) {
    throw new Error("Missing access signature");
  }

  const accessToken = jwt.sign(
    {
      id: verified.id,
      email: verified.email,
    },
    signature,
    {
      expiresIn: "1h",
      audience: String(role),
    },
  );

  return {
    accessToken,
  };
};