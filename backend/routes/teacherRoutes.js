import express from "express";
import {
  registerTeacher,
  loginTeacher,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  verifyTeacher,
  getUnverifiedTeachers,
} from "../controllers/teacher.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.get("/:id", authMiddleware, getTeacher);
router.put("/:id", authMiddleware, updateTeacher);
router.delete("/:id", authMiddleware, deleteTeacher);
router.put(
  "/verify/:teacherId",
  authMiddleware,
  roleMiddleware("admin"),
  verifyTeacher
); // Admin verifies teacher

router.get("/", authMiddleware, roleMiddleware("admin"), getUnverifiedTeachers);

export default router;
