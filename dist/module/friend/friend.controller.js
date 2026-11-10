"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friend_service_1 = require("./friend.service");
const success_responce_1 = require("../../common/exception/success.responce");
const auth_js_1 = require("../../common/middleware/auth/auth.js");
const vaildation_1 = require("../../common/vaildation/vaildation");
const friend_validation_1 = require("./friend.validation");
const router = (0, express_1.Router)();
router.post("/sendFriendRequest", (0, vaildation_1.validate)(friend_validation_1.friendValidation), (0, auth_js_1.auth)(), async (req, res) => {
    const friendService = new friend_service_1.friendservice();
    await friendService.sendFriendRequest(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "user login successflly",
        data: friendService,
    });
});
router.post("/acceptFriendRequest", (0, vaildation_1.validate)(friend_validation_1.friendValidation), (0, auth_js_1.auth)(), async (req, res) => {
    const friendService = new friend_service_1.friendservice();
    await friendService.acceptFriendRequest(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "Friend request accepted successfully",
        data: friendService,
    });
});
router.post("/rejectFriendRequest", (0, vaildation_1.validate)(friend_validation_1.friendValidation), (0, auth_js_1.auth)(), async (req, res) => {
    const friendService = new friend_service_1.friendservice();
    await friendService.rejectFriendRequest(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "Friend request rejected successfully",
        data: friendService,
    });
});
router.get("/getFriends", (0, auth_js_1.auth)(), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const friendService = new friend_service_1.friendservice();
    const friends = await friendService.getFriends(req.user.id);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "Friends retrieved successfully",
        data: friends,
    });
});
router.get("/getFriendRequests", (0, auth_js_1.auth)(), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const friendService = new friend_service_1.friendservice();
    const requests = await friendService.getFriendRequests(req.user.id);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "Friend requests retrieved successfully",
        data: requests,
    });
});
router.post("/blockUser", (0, vaildation_1.validate)(friend_validation_1.friendValidation), (0, auth_js_1.auth)(), async (req, res) => {
    const friendService = new friend_service_1.friendservice();
    await friendService.blockUser(req.body);
    (0, success_responce_1.SuccessResponse)({
        res,
        message: "User blocked successfully",
        data: friendService,
    });
});
exports.default = router;
