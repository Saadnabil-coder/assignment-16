import mongoose from "mongoose";

import { IUser } from "../../common/interfaces/user.interface";
import { GenderEnum, providerEnum, UserRoleEnum } from "../../common/index";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    unique_name: {
      type: String,
      unique: true,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
    },

    phoneNumber: {
      type: String,
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: Number,
      default: GenderEnum.MALE,
    },

    role: {
      type: Number,
      default: UserRoleEnum.USER,
    },

    provider: {
      type: Number,
      default: providerEnum.SYSTEM,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
  },
);

userSchema
  .virtual("username")
  .set(function (this: IUser, value: string) {
    const [firstName, lastName] = value.trim().split(/\s+/);

    this.firstName = firstName || "";
    this.lastName = lastName || "";
  })
  .get(function (this: IUser) {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  });

export const userModel = mongoose.model<IUser>("User", userSchema);