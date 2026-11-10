"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerEnum = exports.UserRoleEnum = exports.GenderEnum = void 0;
var GenderEnum;
(function (GenderEnum) {
    GenderEnum[GenderEnum["MALE"] = 0] = "MALE";
    GenderEnum[GenderEnum["FEMALE"] = 1] = "FEMALE";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum[UserRoleEnum["USER"] = 0] = "USER";
    UserRoleEnum[UserRoleEnum["ADMIN"] = 1] = "ADMIN";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
var providerEnum;
(function (providerEnum) {
    providerEnum[providerEnum["GOOGLE"] = 0] = "GOOGLE";
    providerEnum[providerEnum["SYSTEM"] = 1] = "SYSTEM";
})(providerEnum || (exports.providerEnum = providerEnum = {}));
