import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", authMiddleware, getAdminProfile);

export default router;
