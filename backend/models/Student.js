import mongoose from "mongoose";
import bcrypt from "bcrypt";

const StudentSchema = new mongoose.Schema({
  student_id: { type: String, unique: true, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  subjects_enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  exams_registered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }],
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  isVerified: { type: Boolean, default: false }, // Admin verification
});

// Hash password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Student = mongoose.model("Student", StudentSchema);
export default Student;
