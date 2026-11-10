"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../common/middleware/auth/auth");
const success_responce_1 = require("../../common/exception/success.responce");
const vaildation_1 = require("../../common/vaildation/vaildation");
const comment_validation_1 = require("./comment.validation");
const comment_service_1 = require("./comment.service");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)(), (0, vaildation_1.validate)(comment_validation_1.createCommentValidation), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const comment = await new comment_service_1.CommentService().createComment(req.body, req.user.id);
    return (0, success_responce_1.SuccessResponse)({
        res,
        status: 201,
        message: "Comment created successfully",
        data: comment,
    });
});
router.get("/post/:postId", (0, auth_1.auth)(), async (req, res) => {
    const { postId } = req.params;
    if (typeof postId !== "string") {
        return res.status(400).json({ message: "postId is required" });
    }
    const comments = await new comment_service_1.CommentService().getComments(postId);
    return (0, success_responce_1.SuccessResponse)({
        res,
        message: "Comments retrieved successfully",
        data: comments,
    });
});
router.patch("/:commentId", (0, auth_1.auth)(), (0, vaildation_1.validate)(comment_validation_1.updateCommentValidation), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { commentId } = req.params;
    if (typeof commentId !== "string") {
        return res.status(400).json({ message: "commentId is required" });
    }
    const comment = await new comment_service_1.CommentService().updateComment(commentId, req.body, req.user.id);
    return (0, success_responce_1.SuccessResponse)({
        res,
        message: "Comment updated successfully",
        data: comment,
    });
});
router.delete("/:commentId", (0, auth_1.auth)(), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { commentId } = req.params;
    if (typeof commentId !== "string") {
        return res.status(400).json({ message: "commentId is required" });
    }
    const result = await new comment_service_1.CommentService().deleteComment(commentId, req.user.id);
    return (0, success_responce_1.SuccessResponse)({
        res,
        message: "Comment deleted successfully",
        data: result,
    });
});
exports.default = router;
