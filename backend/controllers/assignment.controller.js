// controllers/assignmentController.js

import Assignment from "../models/Assignment.js";

// Create a new assignment
export const createAssignment = async (req, res) => {
  try {
    const { subject, title, description, dueDate } = req.body;
    let assignedTo = req.body.assignedTo;

    // Parse assignedTo if it's a string
    if (typeof assignedTo === "string") {
      assignedTo = JSON.parse(assignedTo);
    }

    const referenceFileUrl = req.file?.path;

    const assignment = new Assignment({
      subject,
      title,
      description,
      dueDate,
      assignedTo,
      referenceFileUrl,
    });

    await assignment.save();
    res.status(201).json({ message: "Assignment created", assignment });
  } catch (error) {
    console.error("Assignment creation error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get assignments for a subject
export const getAssignmentsBySubject = async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const assignments = await Assignment.find({ subject: subjectId })
      .populate("assignedTo")
      .populate("submissions.student","id");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { studentId } = req.body;
  const fileUrl = req.file?.path;

  if (!studentId) {
    return res.status(400).json({ error: "Missing studentId in request body" });
  }

  if (!fileUrl) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    const now = new Date();
    const deadline = new Date(assignment.dueDate);

    // ⛔️ Reject if current time is past the deadline
    if (now > deadline) {
      return res
        .status(403)
        .json({ error: "Deadline has passed. Cannot submit or resubmit." });
    }

    const existingIndex = assignment.submissions.findIndex(
      (s) => s.student.toString() === studentId
    );

    if (existingIndex !== -1) {
      assignment.submissions[existingIndex].fileUrl = fileUrl;
      assignment.submissions[existingIndex].submittedAt = new Date();
    } else {
      assignment.submissions.push({
        student: studentId,
        submittedAt: new Date(),
        fileUrl,
      });
    }

    await assignment.save();
    res.status(200).json({ message: "File submitted successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Teacher adds feedback and marks
export const gradeSubmission = async (req, res) => {
  const { assignmentId, studentId } = req.params;
  const { marks, feedback } = req.body;
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    const submission = assignment.submissions.find(
      (s) => s.student.toString() === studentId
    );
    if (!submission)
      return res.status(404).json({ error: "Submission not found" });

    submission.marks = marks;
    submission.feedback = feedback;

    await assignment.save();
    res.json({ message: "Grading complete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/assignments/student/:studentId
export const getAssignmentsForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const assignments = await Assignment.find({
      assignedTo: studentId,
    })
      .populate("submissions.student")
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    const assignment = await Assignment.findById(assignmentId)
      .populate("assignedTo", "first_name last_name email") // Populate assigned students (optional)
      .populate("submissions.student", "first_name last_name email "); // Populate submitted students

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (err) {
    console.error("Error fetching assignment:", err.message);
    res.status(500).json({ error: "Server error while fetching assignment" });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const referenceFileUrl = req.file?.path;

    const updateData = { title, description, dueDate };
    if (referenceFileUrl) updateData.referenceFileUrl = referenceFileUrl;

    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updated)
      return res.status(404).json({ error: "Assignment not found" });

    res.json({ message: "Assignment updated", assignment: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Assignment not found" });

    res.json({ message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
