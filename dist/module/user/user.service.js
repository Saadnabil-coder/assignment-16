"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_responce_1 = require("../../common/exception/error.responce");
const HashWord_js_1 = require("../../common/middleware/security/HashWord.js");
const phoneCrypto_js_1 = require("../../common/middleware/security/phoneCrypto.js");
const userRepo_1 = require("./userRepo");
class UserService {
    userRepository;
    constructor() {
        this.userRepository = new userRepo_1.UserRepository();
    }
    async getData(user_id) {
        const userData = await this.userRepository.findById({
            id: user_id,
        });
        if (!userData) {
            throw new error_responce_1.NotFoundException("User not found");
        }
        return userData;
    }
    async updateData(user_id, data, files) {
        const { password, newPassword, phone, name, uniqueName } = data;
        const userData = await this.userRepository.findById({
            id: user_id,
        });
        if (!userData) {
            throw new error_responce_1.NotFoundException("User not found");
        }
        const updatedFields = {};
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
                throw new error_responce_1.ConflictException("Unique name already taken");
            }
            updatedFields.uniqueName = uniqueName;
        }
        if (phone) {
            updatedFields.phone = await (0, phoneCrypto_js_1.EncryptWord)(phone);
        }
        if (password && newPassword) {
            if (!userData.password) {
                throw new error_responce_1.ConflictException("User does not have a password");
            }
            const isMatch = await (0, HashWord_js_1.compareWord)(password, userData.password);
            if (!isMatch) {
                throw new error_responce_1.ConflictException("Current password is incorrect");
            }
            updatedFields.password = await (0, HashWord_js_1.hashWord)(newPassword);
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
            throw new error_responce_1.NotFoundException("User not found");
        }
        return updatedUser;
    }
    async deleteUser({ user_id }) {
        const userData = await this.userRepository.findById({
            id: user_id,
        });
        if (!userData) {
            throw new error_responce_1.NotFoundException("User not found");
        }
        const deletedUser = await this.userRepository.findByIdAndDelete(user_id);
        if (!deletedUser) {
            throw new error_responce_1.NotFoundException("User not found");
        }
        return deletedUser;
    }
}
exports.default = new UserService();
