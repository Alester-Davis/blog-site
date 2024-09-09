import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../controllers/post.controller.js";
import { protect } from "../controllers/auth.controller.js";
const router = express.Router();
const app = express();
router.post("/create-post", protect, createPost);
router.get("/get-post", getPost);

router.delete("/delete-post/:postId/:userId", protect,deletePost);
router.put("/update-post/:postId/:userId",protect, updatePost);

export default router;
