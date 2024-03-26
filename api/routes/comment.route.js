import express from "express";
import { protect } from "../controllers/auth.controller.js";
import { createComment, deleteComment, editComment, getPostComment, likeComment } from "../controllers/comment.controller.js";
const router = express.Router()

router.post("/createComment",protect,createComment)
router.get('/getPostComments/:postId', getPostComment);
router.delete("/deletePostComment/:commentId/:userId",protect,deleteComment)
router.put("/editComment/:commentId/:userId",protect,editComment)
router.put("/likeComment/:commentId",protect,likeComment)
export default router
