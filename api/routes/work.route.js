import express from "express"
import { protect } from "../controllers/auth.controller.js"
import { createWork, deleteWork, displayWork, updateWork } from "../controllers/work.contoller.js"
const router = express.Router()

router.post("/createWork",createWork);
router.get("/getWork",displayWork);
router.put("/updateWork/:workid",updateWork);
router.delete("/deleteWork/:workid",deleteWork);

export default router;