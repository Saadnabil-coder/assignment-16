"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../common/middleware/auth/auth");
const success_responce_1 = require("../../common/exception/success.responce");
const vaildation_1 = require("../../common/vaildation/vaildation");
const multer_1 = require("../../common/utils/multer/multer");
const post_validation_1 = require("./post.validation");
const post_service_1 = require("./post.service");
const multer_2 = require("../../common/utils/multer/multer");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)(), (0, multer_1.upload)().single("image"), (0, vaildation_1.validate)(post_validation_1.createPostValidation), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const post = await new post_service_1.PostService().createPost(req.body, req.user.id, (0, multer_2.getImageUrl)(req.file));
    return (0, success_responce_1.SuccessResponse)({
        res,
        status: 201,
        message: "Post created successfully",
        data: post,
    });
});
router.get("/", (0, auth_1.auth)(), async (_req, res) => {
    const posts = await new post_service_1.PostService().getPosts();
    return (0, success_responce_1.SuccessResponse)({
        res,
        message: "Posts retrieved successfully",
        data: posts,
    });
});
router.get("/mine", (0, auth_1.auth)(), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const posts = await new post_service_1.PostService().getUserPosts(req.user.id);
    return (0, success_responce_1.SuccessResponse)({
        res,
        message: "Your posts retrieved successfully",
        data: posts,
    });
});
router.patch("/:postId", (0, auth_1.auth)(), (0, multer_1.upload)().single("image"), (0, vaildation_1.validate)(post_validation_1.updatePostValidation), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { postId } = req.params;
    if (typeof postId !== "string") {
        return res.status(400).json({ message: "postId is required" });
    }
    const post = await new post_service_1.PostService().updatePost(postId, req.body, req.user.id, (0, multer_2.getImageUrl)(req.file));
    return (0, success_responce_1.SuccessResponse)({
        res,
        message: "Post updated successfully",
        data: post,
    });
});
router.delete("/:postId", (0, auth_1.auth)(), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { postId } = req.params;
    if (typeof postId !== "string") {
        return res.status(400).json({ message: "postId is required" });
    }
    const result = await new post_service_1.PostService().deletePost(postId, req.user.id);
    return (0, success_responce_1.SuccessResponse)({
        res,
        message: "Post deleted successfully",
        data: result,
    });
});
exports.default = router;
