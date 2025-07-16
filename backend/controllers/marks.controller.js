// import Marks from "../models/Marks.js";
// import Student from "../models/Student.js";
// import Exam from "../models/Exam.js";
import Subject from "../models/Subject.js";
// import Marks from "../models/Marks.js";
import Student from "../models/Student.js";
import Exam from "../models/Exam.js";
import Marks from "../models/Marks.js";
import Grading from "../models/Grading.js";

export const addMarks = async (req, res) => {
  try {
     console.log("hit /add");
    const { student_id, subject_id, exam_id, marks_obtained, total_marks } = req.body;
    const graded_by = req.user._id; // From verifyFaculty

    const newMark = new Marks({
      student_id,
      subject_id,
      exam_id,
      marks_obtained,
      total_marks,
      graded_by,
    });

    await newMark.save();
    res.status(201).json({ message: "Marks added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add marks", error });
  }
};

export const getStudentsWithGrades = async (req, res) => {
  try {
    const { branch, semester, exam_id } = req.query;

    if (!branch || !semester || !exam_id) {
      return res.status(400).json({ message: "Branch, semester, and exam_id required." });
    }

    // ✅ Only fetch students verified by admin
    const students = await Student.find({
      branch,
      semester,
      isVerified: true,
    });

    const gradedMarks = await Marks.find({ exam_id });
    const gradedMap = new Map();

    gradedMarks.forEach((mark) => {
      gradedMap.set(mark.student_id.toString(), mark);
    });

    const response = students.map((student) => ({
      _id: student._id,
      name: `${student.first_name} ${student.last_name}`,
      email: student.email,
      graded: gradedMap.has(student._id.toString()),
      marks: gradedMap.get(student._id.toString()) || null,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};





export const autoGradeStudents = async (req, res) => {
  try {
    const { subject_id } = req.query;

    const exams = await Exam.find({ subject_id }).select("_id exam_type");

    const examMap = {};
    for (let exam of exams) {
      examMap[exam._id.toString()] = exam.exam_type;
    }

    const allMarks = await Marks.find({ exam_id: { $in: exams.map(e => e._id) } });

    const studentScores = {};

    for (const mark of allMarks) {
      const examType = examMap[mark.exam_id.toString()];
      const obtained = mark.marks_obtained;

      if (!studentScores[mark.student_id]) {
        studentScores[mark.student_id] = 0;
      }

      if (examType === "Final") {
        // Final out of 100 → 60%
        studentScores[mark.student_id] += (obtained / 100) * 60;
      } else if (examType === "Midterm") {
        // Midterm out of 40 → take ½ (i.e. 20 max) → 20%
        const halfMST = obtained / 2; // max 20
        studentScores[mark.student_id] += (halfMST / 20) * 20;
      } else if (examType === "Practical") {
        // Practical out of 20 → 20%
        studentScores[mark.student_id] += (obtained / 20) * 20;
      }
    }

    const studentAverages = Object.entries(studentScores).map(([studentId, score]) => ({
      studentId,
      avg: score,
    }));

    const mean = studentAverages.reduce((acc, cur) => acc + cur.avg, 0) / studentAverages.length;
    const stddev = Math.sqrt(
      studentAverages.reduce((acc, cur) => acc + Math.pow(cur.avg - mean, 2), 0) / studentAverages.length
    );

    const gradedResults = studentAverages.map(({ studentId, avg }) => {
      let grade = "C";
      if (avg >= mean + stddev) grade = "A";
      else if (avg >= mean) grade = "B";
      else if (avg >= mean - stddev) grade = "C";
      else grade = "D";

      return { studentId, averageScore: avg.toFixed(2), grade };
    });

    await Grading.deleteMany({ subject_id });

    await Promise.all(
      gradedResults.map(r =>
        new Grading({
          subject_id,
          student_id: r.studentId,
          grade: r.grade,
          averageScore: r.averageScore,
          mean,
          stddev,
        }).save()
      )
    );

    const finalResults = await Grading.find({ subject_id })
      .populate("student_id", "first_name last_name email")
      .sort({ grade: 1 });

    res.status(200).json({ mean, stddev, results: finalResults });
  } catch (err) {
    res.status(500).json({ message: "Auto-grading failed", error: err.message });
  }
};

export const getGradesBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const grades = await Grading.find({ subject_id })
      .populate("student_id", "first_name last_name email")
      .sort({ grade: 1 });
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch grades", error: err.message });
  }
};


// controllers/subject.controller.js
export const getAllSubjects = async (req, res) => {
  try {
    // Example: return mock subjects or fetch from DB
    const subjects = [
      { id: "sub1", name: "Mathematics" },
      { id: "sub2", name: "Physics" },
      { id: "sub3", name: "Chemistry" }
    ];
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

export const updateMarks = async (req, res) => {
  try {
    const { mark_id } = req.params;
    const { marks_obtained, total_marks } = req.body;

    console.log("UPDATE MARK ID:", mark_id);

    const updated = await Marks.findByIdAndUpdate(
      mark_id,
      { marks_obtained, total_marks },
      { new: true }
    );

    if (!updated) {
      console.log("No mark found");
      return res.status(404).json({ message: "Marks not found" });
    }

    res.status(200).json({ message: "Marks updated", updated });
  } catch (error) {
    console.error("Update Error", error);
    res.status(500).json({ message: "Failed to update marks", error });
  }
};
export const deleteMarks = async (req, res) => {
  try {
    const { mark_id } = req.params;
    console.log("DELETE MARK ID:", mark_id);
    const deleted = await Marks.findByIdAndDelete(mark_id);
    if (!deleted) {
      console.log("No mark found to delete");
      return res.status(404).json({ message: "Marks not found" });
    }
    res.status(200).json({ message: "Marks deleted" });
  } catch (error) {
    console.error("Delete Error", error);
    res.status(500).json({ message: "Failed to delete marks", error });
  }
};

export const getGradesByStudent = async (req, res) => {
  try {
    console.log("📌 Token student object from req.user:", req.user);

    const studentId = req.user?._id;

    if (!studentId) {
      console.error("❌ No student ID found in token");
      return res.status(401).json({ message: "Unauthorized. No student ID." });
    }

    const grades = await Grading.find({ student_id: studentId })
      .populate({
        path: "subject_id",
        select: "subject_name",
      })
      .sort({ grade: 1 });

    console.log("✅ Grades fetched:", grades);

    res.status(200).json(grades);
  } catch (err) {
    console.error("🔥 Error in getGradesByStudent:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
