import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/Student.js";
import Exam from "../models/Exam.js";
import Subject from "../models/Subject.js"
dotenv.config();

export const registerStudent = async (req, res) => {
  try {
    const {
      student_id,
      first_name,
      last_name,
      branch,
      semester,
      email,
      password,
    } = req.body;

    if (
      !student_id ||
      !first_name ||
      !last_name ||
      !branch ||
      !semester ||
      !email ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ error: "Student with this email already exists." });
    }

    // Fetch subjects based on branch and semester
    const subjects = await Subject.find({ branch, semester });

    // Fetch exams linked to these subjects
    const exams = await Exam.find({
      subject_id: { $in: subjects.map((sub) => sub._id) },
    });

    // Create a new student entry
    const newStudent = new Student({
      student_id,
      first_name,
      last_name,
      branch,
      semester,
      email,
      password,
      subjects_enrolled: subjects.map((sub) => sub._id),
      exams_registered: exams.map((exam) => exam._id),
    });

    await newStudent.save();

    // Update Exam Documents to Register the Student
    await Exam.updateMany(
      { _id: { $in: exams.map((exam) => exam._id) } },
      { $push: { students_registered: newStudent._id } }
    );

    res.status(201).json({
      message: "Student registered successfully!",
      student: newStudent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering student", error: error.message });
  }
};


// Login Student (Only if verified)
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.isVerified) {
      return res
        .status(403)
        .json({ message: "Account not verified. Await admin approval." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Use student instead of user
    const token = jwt.sign(
      {
        id: student._id,
        student_id: student.student_id,
        email: student.email,
        role: "student",
        branch: student.branch,
        semester: student.semester,
        first_name: student.first_name,
        last_name: student.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      student, // you can optionally include this
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Admin verifies student
export const verifyStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { isVerified: true },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student verified successfully", student });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying student", error: error.message });
  }
};

// Get Student
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "subjects_enrolled exams_registered"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student details",
      error: error.message,
    });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const { branch, semester } = req.body;

    let updateFields = { ...req.body };

    // Fetch the student
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // If branch or semester is updated, fetch new subjects & exams
    if (branch || semester) {
      const subjects = await Subject.find({ branch, semester });
      const exams = await Exam.find({
        subject_id: { $in: subjects.map((sub) => sub._id) },
      });

      updateFields.subjects_enrolled = subjects.map((sub) => sub._id);
      updateFields.exams_registered = exams.map((exam) => exam._id);

      // Remove student from old exams
      await Exam.updateMany(
        { students_registered: student._id },
        { $pull: { students_registered: student._id } }
      );

      // Register student for new exams
      await Exam.updateMany(
        { _id: { $in: exams.map((exam) => exam._id) } },
        { $push: { students_registered: student._id } }
      );
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate("subjects_enrolled exams_registered");

    res
      .status(200)
      .json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
};

export const getUnverifiedStudents = async (req, res) => {
  try {
    const students = await Student.find({ isVerified: false });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unverified students",
      error: error.message,
    });
  }
};

// Get Students by Branch and Semester


export const getStudentsByBranchSemester = async (req, res) => {
  try {
    const { branch, semester } = req.query;

    if (!branch || !semester) {
      return res
        .status(400)
        .json({ message: "Branch and semester are required" });
    }

    const students = await Student.find({
      branch,
      semester: parseInt(semester),
    });

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

