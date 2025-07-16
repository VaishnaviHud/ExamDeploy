import express from "express";
import Exam from "../models/Exam.js";
import {
  registerStudent,
  loginStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  verifyStudent,
  getUnverifiedStudents,

} from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js"; // Updated Middleware

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/:id", authMiddleware, getStudent);
router.put("/:id", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);
router.put(
  "/verify/:studentId",
  authMiddleware,
  roleMiddleware("admin"), // Only Admins Can Verify
  verifyStudent
);
router.get("/exams", verifyStudent, async (req, res) => {
  try {
    const student = req.user; // Get student from token
    const exams = await Exam.find({ semester: student.semester }).populate("subject_id");

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams", error });
  }
});

router.get("/", authMiddleware, roleMiddleware("admin"), getUnverifiedStudents);


export default router;
