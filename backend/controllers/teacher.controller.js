import Teacher from "../models/Teacher.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const { teacher_id, first_name, last_name, department, email, password } =
      req.body;

    // ✅ Validate all fields
    if (
      !teacher_id ||
      !first_name ||
      !last_name ||
      !email ||
      !department ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const newTeacher = new Teacher({
      teacher_id,
      first_name,
      last_name,
      department,
      email,
      password,
    });

    await newTeacher.save();

    res.status(201).json({
      message: "Teacher registered successfully, awaiting admin verification.",
      newTeacher
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Login Teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!teacher.isVerified)
      return res.status(403).json({ message: "Account not verified by admin" });

    // Include relevant fields in token so frontend gets all profile info from jwtDecode()
    const tokenPayload = {
      id: teacher._id,
      role: teacher.role,
      teacher_id: teacher.teacher_id,
      email: teacher.email,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      department: teacher.department,
      is_supervisor: teacher.is_supervisor,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get Teacher by ID
export const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");
    if (!updatedTeacher)
      return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify Teacher (Admin Only)
export const verifyTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.teacherId,
      { isVerified: true },
      { new: true }
    );
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({ message: "Teacher verified successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUnverifiedTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isVerified: false });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};