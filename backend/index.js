import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import studentRoutes from "./routes/student.route.js"; 

import teacherRoutes from "./routes/teacherRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js"
import examRoutes from "./routes/examRoutes.js";
import seatingRoute from "./routes/seatingRoutes.js"
import cors from "cors";
import marksRoutes from "./routes/marksRoutes.js";
import "./controllers/cleanupScheduler.js"; // Must be placed after DB connection

// import marksRoutes from "./routes/marks.js";

import assignmentRoutes from "./routes/assignmentRoutes.js"
// import subjectRoutes from "./routes/subjectsRoutes.js";
import testRoutes from "./routes/testRoutes.js";


dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
mongoose
.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/subjects",subjectRoutes);
app.use("/api/exams", examRoutes); // Add exam routes here
app.use("/api/seating",seatingRoute);
// app.use("/api/subjects", subjectRoutes); 
app.use("/api/marks", marksRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/test", testRoutes);
// app.use("/api/marks", marksRoutes);
// app.use("/api/marks", marksRoutes);
console.log("✅ marksRoutes mounted at /api/marks");



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
