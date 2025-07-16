// import express from "express";
// import Student from "../models/Student.js";
// //import authMiddleware from "../middleware/authMiddleware.js"; // Ensure this exists
// import authMiddleware, { verifyStudent as verifyStudentMiddleware } from "../middlewares/authMiddleware.js";
// import roleMiddleware from "../middlewares/roleMiddleware.js";
// import Exam from "../models/Exam.js";
// const router = express.Router();
// import {
//   registerStudent,
//   loginStudent,
//   verifyStudent as verifyStudentAdmin,
//   getStudent,
//   updateStudent,
//   deleteStudent,
//   getUnverifiedStudents,
//   getStudentsByBranchSemester
 
// } from "../controllers/student.controller.js";
// import { getGradesByStudent } from "../controllers/marks.controller.js";

// router.get('/filter', getStudentsByBranchSemester);


// // GET all students (only authentication required, no role check)
// router.get("/all", authMiddleware, async (req, res) => {
//   try {
//     const students = await Student.find({}, "-password"); // Exclude password
//     res.json(students);
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     res.status(500).json({ message: "Failed to fetch students", error });
//   }
// });
// router.post("/register", registerStudent);
// router.post("/login", loginStudent);
// router.get("/:id", authMiddleware, getStudent);
// router.put("/:id", authMiddleware, updateStudent);
// router.delete("/:id", authMiddleware, deleteStudent);
// router.put(
//   "/verify/:studentId",
//   authMiddleware,
//   roleMiddleware("admin"), // Only Admins Can Verify
//   verifyStudentAdmin
// );
// router.get("/exams", verifyStudentMiddleware, async (req, res) => {
//   try {
//     const student = req.user; // Get student from token
//     const exams = await Exam.find({ semester: student.semester }).populate("subject_id");

//     res.json(exams);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching exams", error });
//   }
// });

// router.get("/", authMiddleware, roleMiddleware("admin"), getUnverifiedStudents);
// // router.get("/grades", verifyStudent, getGradesByStudent);
// router.get("/grades", verifyStudentMiddleware, getGradesByStudent);
// router.get("/test-populate", async (req, res) => {
//   try {
//     const result = await Grading.findOne().populate("subject_id", "subject_name");
//     console.log("🎯 Test Populate Result:", result);
//     res.json(result);
//   } catch (err) {
//     console.error("❌ Test Populate Error:", err);
//     res.status(500).json({ message: "Populate test failed", error: err.message });
//   }
// });


// export default router;
import express from "express";
import Student from "../models/Student.js";
import authMiddleware, { verifyStudent as verifyStudentMiddleware } from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import Exam from "../models/Exam.js";
import { getGradesByStudent } from "../controllers/marks.controller.js";
import {
  registerStudent,
  loginStudent,
  verifyStudent as verifyStudentAdmin,
  getStudent,
  updateStudent,
  deleteStudent,
  getUnverifiedStudents,
  getStudentsByBranchSemester
} from "../controllers/student.controller.js";
import Grading from "../models/Grading.js";

const router = express.Router();

// ✅ Place this early
router.get("/grades", verifyStudentMiddleware, getGradesByStudent);

// ✅ Route to test populate
router.get("/test-populate", async (req, res) => {
  try {
    const result = await Grading.findOne().populate("subject_id", "subject_name");
    console.log("🎯 Test Populate Result:", result);
    res.json(result);
  } catch (err) {
    console.error("❌ Test Populate Error:", err);
    res.status(500).json({ message: "Populate test failed", error: err.message });
  }
});

router.get("/filter", getStudentsByBranchSemester);
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find({}, "-password");
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students", error });
  }
});

router.get("/", authMiddleware, roleMiddleware("admin"), getUnverifiedStudents);
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.put("/verify/:studentId", authMiddleware, roleMiddleware("admin"), verifyStudentAdmin);

router.get("/exams", verifyStudentMiddleware, async (req, res) => {
  try {
    const student = req.user;
    const exams = await Exam.find({ semester: student.semester }).populate("subject_id");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams", error });
  }
});

// ❌ This must come last — it's a dynamic route
router.get("/:id", authMiddleware, getStudent);
router.put("/:id", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

export default router;
