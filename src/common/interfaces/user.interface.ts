import { GenderEnum, providerEnum, UserRoleEnum } from "../enum/user.enum";

export interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  is_verified: boolean;
  unique_name: string;
  email: string;
  password: string;
  age: number;
  phoneNumber: string;
  confirmEmail: boolean;
  gender?: GenderEnum;
  role?: UserRoleEnum;
  provider?: providerEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserUpdateData {
  name?: string;
  unique_name?: string;
  phone?: string;
  password?: string;
  newPassword?: string;
  uniqueName?: string;
}