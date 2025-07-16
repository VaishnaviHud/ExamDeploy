import express from "express";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import { getAllSubjects } from "../controllers/marks.controller.js";

const router = express.Router();

// Add a new subject
router.post("/add", async (req, res) => {
  try {
    const { subject_id, subject_name, branch, semester, faculty_id } = req.body;

    const newSubject = new Subject({ subject_id, subject_name, branch, semester, faculty_id });
    await newSubject.save();

     await Student.updateMany(
      { branch, semester },
      { $addToSet: { subjects_enrolled: newSubject._id } }
    );

    res.status(201).json({ message: "Subject added successfully!", subject: newSubject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subjects
router.get("/list", async (req, res) => {
  try {
    const subjects = await Subject.find().populate("faculty_id", "first_name last_name email");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of teachers
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find({}, "first_name last_name email");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export const getSubjectsByTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const subjects = await Subject.find({ faculty_id: teacherId });

    if (!subjects.length) {
      return res
        .status(404)
        .json({ message: "No subjects assigned to this teacher" });
    }

    res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects for teacher:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSubjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findById(id).populate(
      "faculty_id",
      "-password"
    );

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (err) {
    console.error("Error fetching subject by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export const getStudentSubjects = async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const subjects = await Subject.find({
      branch: student.branch,
      semester: student.semester,
    }).populate("faculty_id", "first_name last_name email");

    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/subjects
router.get("/", getAllSubjects);
router.get("/faculty/:teacherId", getSubjectsByTeacher);
router.get("/:id", getSubjectById);
router.get("/student/:id", getStudentSubjects);

export default router;



