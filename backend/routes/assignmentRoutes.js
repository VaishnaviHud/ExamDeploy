// routes/assignmentRoutes.js

import express from "express";
import {
  createAssignment,
  getAssignmentsBySubject,
  submitAssignment,
  gradeSubmission,
  getAssignmentsForStudent,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment.controller.js";
import upload from "../middlewares/upload.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// POST /api/assignments

router.post("/", authMiddleware, roleMiddleware("teacher"), upload.single("referenceFile"), createAssignment);

// GET /api/assignments/subject/:subjectId
router.get("/subject/:subjectId", authMiddleware, getAssignmentsBySubject);

// POST /api/assignments/:assignmentId/submit
router.post("/:assignmentId/submit", authMiddleware, upload.single("file"), submitAssignment);

// PUT /api/assignments/:assignmentId/grade/:studentId
router.put("/:assignmentId/grade/:studentId", authMiddleware,  roleMiddleware("teacher"), gradeSubmission);

router.get("/student/:studentId", getAssignmentsForStudent);

router.get("/:assignmentId", authMiddleware, getAssignmentById);

router.put("/:id",authMiddleware, roleMiddleware("teacher"), upload.single("referenceFile"), updateAssignment);
router.delete("/:id", authMiddleware, roleMiddleware("teacher"),deleteAssignment);


export default router;
