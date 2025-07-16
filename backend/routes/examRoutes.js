// import express from "express";
// import Exam from "../models/Exam.js";
// import Student from "../models/Student.js";
// import { verifyAdmin } from "../middleware/auth.js"; // Ensure admin authentication

// const router = express.Router();

// // Admin adds an exam for a specific semester
// router.post("/add", verifyAdmin, async (req, res) => {
//   try {
//     const { exam_id, subject_id, semester, exam_date, duration, exam_type, supervisors } = req.body;

//     // Fetch all students in the given semester
//     const students = await Student.find({ semester }).select("_id");

//     if (!students.length) {
//       return res.status(400).json({ message: "No students found in this semester." });
//     }

//     const newExam = new Exam({
//       exam_id,
//       subject_id,
//       semester,
//       exam_date,
//       duration,
//       exam_type,
//       students_registered: students.map((s) => s._id), // Auto-register students
//       supervisors,
//     });

//     await newExam.save();
//     res.status(201).json({ message: "Exam added successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding exam", error });
//   }
// });

// export default router;
// controllers/examController.js
import express from "express";
import { addMarks } from "../controllers/marks.controller.js";
import { verifyFaculty } from "../middlewares/authMiddleware.js"; 
import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getAllSubjects,
  getAllTeachers,
} from "../controllers/exam.controller.js";
// import { getExamsByBranch } from "../controllers/exam.controller.js";
// routes/examRoutes.js
import { getExamsByBranchAndSemester } from "../controllers/exam.controller.js";
//getExamsByBranchAndSemester
// routes/examRoutes.js
// import { addMarks } from "../controllers/marks.controller.js";





const router = express.Router();

// Route to create a new exam
router.post("/create", createExam);

// Route to get all exams
router.get("/all", getAllExams);
// Add this dynamic route ABOVE the /:id route
router.get("/", getExamsByBranchAndSemester);

// Route to get an exam by ID
router.get("/:id", getExamById);

// Route to update an exam
router.put("/:id", updateExam);

// Route to delete an exam
router.delete("/:id", deleteExam);

// Route to get all subjects (for dropdown)
router.get("/subjects/all", getAllSubjects);

// Route to get all teachers (for supervisor assignment)
router.get("/teachers/all", getAllTeachers);
router.post("/add", verifyFaculty, addMarks);
// router.get("/filter", getExamsByBranch);

//router.get("/by-branch-semester",getExamsByBranchAndSemester);

// router.post("/add-marks", verifyFaculty, addMarks);

export default router;
