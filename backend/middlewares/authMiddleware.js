import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";


dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};


// middlewares/authMiddleware.js

// Example middleware to verify if the token is valid
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// ✅ Add this middleware for faculty role verification
// export const verifyFaculty = (req, res, next) => {
//   if (req.user?.role !== "faculty") {
//     return res.status(403).json({ message: "Access denied: Faculty only" });
//   }
//   next();
// };
// export const verifyFaculty = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const teacher = await Teacher.findById(decoded.id); // `decoded.id` must match Mongo `_id`
//     if (!teacher) {
//       return res.status(404).json({ message: "Teacher not found." });
//     }

//     req.user = teacher; // Now `req.user._id` can be used in controller
//     next();
//   } catch (err) {
//     return res.status(400).json({ message: "Invalid token." });
//   }
// };
export const verifyFaculty = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Check if token contains a 'role' field
    if (decoded.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Not a teacher." });
    }

    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    req.user = teacher;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

export const verifyStudent = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access denied. No token." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    req.user = student;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};





export default authMiddleware;
