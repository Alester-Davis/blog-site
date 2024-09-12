import express from "express";
import {
  googleAuth,
  protect,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import passport from "passport";
const router = express.Router();
const signToken = (id) => {
  return jwt.sign({ id }, "alester-davis", { expiresIn: "1h" });
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({ user, token });
};

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    sendToken(req.user, 200, res);
  }
);
router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/google", googleAuth);
router.get("/sign-out", signout);
router.put("/update-user/:userid", protect, updateUser);
router.delete("/delete-user/:userId", protect, deleteUser);
export default router;
