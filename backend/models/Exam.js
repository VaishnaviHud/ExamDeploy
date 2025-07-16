import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
  exam_id: { type: String, unique: true, required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  semester: { type: Number, required: true }, // Semester field added
  exam_date: { type: Date, required: true },
  duration: { type: Number, required: true }, // Example: "3 hours"
  exam_type: {
    type: String,
    enum: ["Midterm", "Final", "Practical"],
    required: true,
  },
  students_registered: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  ], // Auto-registered
  supervisors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
});

export default mongoose.model("Exam", ExamSchema);
