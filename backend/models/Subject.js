import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  subject_id: { type: String, unique: true, required: true },
  subject_name: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }, // Subject assigned to a teacher
});

export default mongoose.model("Subject", SubjectSchema);
