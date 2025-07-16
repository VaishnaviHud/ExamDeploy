import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  marks_obtained: { type: Number, required: true },
  total_marks: { type: Number, required: true },
  graded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});

const Marks = mongoose.model("Marks", MarksSchema);
export default Marks;
