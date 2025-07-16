// models/Assignment.js

import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    referenceFileUrl: {
      type: String,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        fileUrl: String,
        submittedAt: Date,
        marks: Number,
        feedback: String,
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
