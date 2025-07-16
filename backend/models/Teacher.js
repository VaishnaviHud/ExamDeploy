import mongoose from "mongoose";
import bcrypt from "bcrypt";

const TeacherSchema = new mongoose.Schema({
  teacher_id: { type: String, unique: true, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  department: { type: String, required: true },
  subjects_taught: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  is_supervisor: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }, // Admin verification flag
  password: { type: String, required: true }, // Hashed password
  role: { type: String, default: "teacher" },
});

// Hash password before saving
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
export default Teacher;
