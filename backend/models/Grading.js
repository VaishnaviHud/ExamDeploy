// models/Grading.js
import mongoose from "mongoose";

const GradingSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  grade: { type: String, required: true },
  averageScore: { type: Number, required: true },
  mean: { type: Number, required: true },
  stddev: { type: Number, required: true },
  graded_at: { type: Date, default: Date.now },
});

// ✅ Default export
const Grading = mongoose.model("Grading", GradingSchema);
export default Grading;
