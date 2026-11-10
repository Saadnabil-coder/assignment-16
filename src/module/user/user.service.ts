import {
  ConflictException,
  NotFoundException,
} from "../../common/exception/error.responce";

import {
  hashWord,
  compareWord,
} from "../../common/middleware/security/HashWord.js";
import { EncryptWord } from "../../common/middleware/security/phoneCrypto.js";
import { IUserUpdateData } from "../../common";
import { UserRepository } from "./userRepo";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getData(user_id: string) {
    const userData = await this.userRepository.findById({
      id: user_id,
    });

    if (!userData) {
      throw new NotFoundException("User not found");
    }

    return userData;
  }

  async updateData(
    user_id: string,
    data: IUserUpdateData,
    files?: Express.Multer.File[],
  ) {
    const { password, newPassword, phone, name, uniqueName } = data;

    const userData = await this.userRepository.findById({
      id: user_id,
    });

    if (!userData) {
      throw new NotFoundException("User not found");
    }

    const updatedFields: Record<string, unknown> = {};

    if (name) {
      updatedFields.name = name;
    }

    if (uniqueName) {
      const uniqueNameExist = await this.userRepository.findOne({
        filter: {
          uniqueName,
          _id: { $ne: user_id },
        },
      });

      if (uniqueNameExist) {
        throw new ConflictException("Unique name already taken");
      }

      updatedFields.uniqueName = uniqueName;
    }

    if (phone) {
      updatedFields.phone = await EncryptWord(phone);
    }

    if (password && newPassword) {
      if (!userData.password) {
        throw new ConflictException("User does not have a password");
      }

      const isMatch = await compareWord(password, userData.password);

      if (!isMatch) {
        throw new ConflictException("Current password is incorrect");
      }

      updatedFields.password = await hashWord(newPassword);
    }

    if (files?.length) {
      const file = files[0];

      if (file?.path) {
        updatedFields.profileImage = `${process.env.SERVER_URL}/${file.path.replace(/\\/g, "/")}`;
      }
    }

    const updatedUser = await this.userRepository.findByIdAndUpdate({
      id: user_id,
      data: updatedFields,
    });

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return updatedUser;
  }
  async deleteUser({user_id}: { user_id: string }) {
    const userData = await this.userRepository.findById({
      id: user_id,
    }); 
    if(!userData){
      throw new NotFoundException("User not found");
    }
    const deletedUser = await this.userRepository.findByIdAndDelete(user_id);

   if (!deletedUser) {
     throw new NotFoundException("User not found");
   }
    return deletedUser;

}
}
export default new UserService();