import Exam from "../models/Exam.js";
import Subject from "../models/Subject.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Marks from "../models/Marks.js";
import { v4 as uuidv4 } from "uuid";

// Create a new exam
// Create a new exam with supervisors
export const createExam = async (req, res) => {
  try {
    const { subject_id, exam_date, duration, exam_type, supervisors } = req.body;

    // Get the subject to fetch semester information
    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Generate unique exam_id
    const exam_id = `EXAM-${uuidv4().slice(0, 6)}`;

    // Get all students in this semester and branch who are enrolled in the subject
    const eligibleStudents = await Student.find({
      semester: subject.semester,
      branch: subject.branch,
      subjects_enrolled: subject_id
    });

    // Validate supervisors (check if all provided IDs are valid teachers)
    if (supervisors && supervisors.length > 0) {
      const teacherIds = supervisors.map(id => id);
      const validTeachers = await Teacher.find({ _id: { $in: teacherIds } });

      if (validTeachers.length !== teacherIds.length) {
        return res.status(400).json({ message: "One or more supervisors not found" });
      }
    } else {
      return res.status(400).json({ message: "At least one supervisor must be assigned" });
    }

    // Create new exam
    const newExam = new Exam({
      exam_id,
      subject_id,
      semester: subject.semester,
      exam_date,
      duration,
      exam_type,
      students_registered: eligibleStudents.map(student => student._id),
      supervisors // Assign provided supervisors
    });

    // Save the exam
    const savedExam = await newExam.save();

    // Update students' exams_registered array
    await Student.updateMany(
      { _id: { $in: eligibleStudents.map(student => student._id) } },
      { $push: { exams_registered: savedExam._id } }
    );

    res.status(201).json(savedExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: "Error creating exam", error: error.message });
  }
};


// Get all exams
// export const getAllExams = async (req, res) => {
//   try {
//     const exams = await Exam.find()
//       .populate("subject_id", "subject_name branch semester")
//       .populate("students_registered", "student_id first_name last_name")
//       .populate("supervisors", "teacher_id first_name last_name");
    
//     res.status(200).json(exams);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      exam_date: { $gte: new Date() }  // ✅ Only future or today's exams
    })
      .populate("subject_id", "subject_name branch semester")
      .populate("students_registered", "student_id first_name last_name")
      .populate("supervisors", "teacher_id first_name last_name");

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get exam by ID
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("subject_id", "subject_name branch semester")
      .populate("students_registered", "student_id first_name last_name")
      .populate("supervisors", "teacher_id first_name last_name");
    
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update exam
export const updateExam = async (req, res) => {
  try {
    const { supervisors, exam_date, duration, exam_type } = req.body;
    
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    
    // Update supervisors if provided
    if (supervisors && supervisors.length > 0) {
      // Verify all supervisors exist and are valid teachers
      const teacherIds = supervisors.map(id => id);
      const teachers = await Teacher.find({ _id: { $in: teacherIds } });
      
      if (teachers.length !== teacherIds.length) {
        return res.status(400).json({ message: "One or more supervisors not found" });
      }
      
      exam.supervisors = teacherIds;
    }
    
    // Update other fields if provided
    if (exam_date) exam.exam_date = exam_date;
    if (duration) exam.duration = duration;
    if (exam_type) exam.exam_type = exam_type;
    
    const updatedExam = await exam.save();
    
    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    
    // Remove exam from students' exams_registered array
    await Student.updateMany(
      { _id: { $in: exam.students_registered } },
      { $pull: { exams_registered: exam._id } }
    );
    
    await exam.remove();
    
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subjects (for dropdown)
// export const getAllSubjects = async (req, res) => {
//   try {
//     const subjects = await Subject.find().select("subject_id subject_name branch semester");
//     res.status(200).json(subjects);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().select("subject_name branch semester");
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all teachers (for supervisor assignment)
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("teacher_id first_name last_name department is_supervisor");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addMarks = async (req, res) => {
  try {
    const { student_id, subject_id, exam_id, marks_obtained, total_marks } = req.body;
    const graded_by = req.user._id; // Make sure verifyFaculty sets req.user

    // Optional: prevent duplicate entries
    const exists = await Marks.findOne({ student_id, subject_id, exam_id });
    if (exists) {
      return res.status(400).json({ message: "Marks already entered for this student in this exam." });
    }

    const newMarks = new Marks({
      student_id,
      subject_id,
      exam_id,
      marks_obtained,
      total_marks,
      graded_by,
    });

    await newMarks.save();
    res.status(201).json({ message: "Marks submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error adding marks", error: err });
  }
};


// controllers/exam.controller.js
// export const getExamsByBranchAndSemester = async (req, res) => {
//   try {
//     const { branch, semester } = req.params;

//     const exams = await Exam.find({ branch, semester });

//     res.status(200).json(exams);
//   } catch (error) {
//     console.error("Error fetching exams:", error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };

export const getExamsByBranchAndSemester = async (req, res) => {
  try {
    const { branch, semester } = req.query;

    const exams = await Exam.find({ semester }) // Step 1: filter by semester
      .populate({
        path: "subject_id",
        match: { branch }, // Step 2: match only subjects of given branch
      });

    // Step 3: filter out null subjects (those that didn’t match the branch)
    const filteredExams = exams.filter((exam) => exam.subject_id !== null);

    res.status(200).json(filteredExams);
  } catch (error) {
    console.error("Error in getExamsByBranchAndSemester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

