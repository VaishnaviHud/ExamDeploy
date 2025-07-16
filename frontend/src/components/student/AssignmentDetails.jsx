import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, UploadCloud, X } from "lucide-react";

const AssignmentDetails = ({ assignment, studentId, refresh }) => {
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const submission =
    assignment.submissions?.find((s) => s.student._id === studentId) || null;

  const handleSubmit = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", studentId);

    try {
      await axios.post(`/api/assignment/${assignment._id}/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Submitted successfully!");
      setFile(null);
      refresh?.();
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed");
    }
  };

  const deadline = new Date(assignment.dueDate);
  const isPastDeadline = deadline < new Date();

  return (
    <motion.div
      className=" rounded-xl shadow-lg  p-6 w-full max-w-3xl mx-auto mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          {assignment.title}
        </h2>
        
      </div>

      <p className="text-gray-700 mb-2">{assignment.description}</p>

      <p className="text-sm mb-4">
        <strong>Due Date:</strong>{" "}
        <span className={isPastDeadline ? "text-red-600" : "text-green-600"}>
          {deadline.toLocaleDateString()}
        </span>
      </p>

      {/* Submission Section */}
      <AnimatePresence mode="wait">
        {submission ? (
          <motion.div
            key="submitted"
            className="bg-green-50 border border-green-300 p-4 rounded mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-green-800 font-medium mb-1">
              Submitted on:{" "}
              {new Date(submission.submittedAt).toLocaleString()}
            </p>
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View Submitted File
            </a>
            {submission.marks !== undefined && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Marks:</strong> {submission.marks}
                </p>
                <p>
                  <strong>Feedback:</strong> {submission.feedback}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.p
            key="not-submitted"
            className="text-gray-600 mb-3 text-sm italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            You have not submitted this assignment yet.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Upload Section */}
      {!isPastDeadline && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-auto"
            />
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition text-sm"
            >
              <UploadCloud size={18} />
              {submission ? "Resubmit" : "Submit"}
            </button>
          </div>
          {file && (
            <p className="text-xs text-gray-600 italic">
              Selected: {file.name}
            </p>
          )}
        </div>
      )}

      {/* Deadline Passed Message */}
      {isPastDeadline && !submission && (
        <p className="text-red-600 mt-4 text-sm font-semibold">
          Deadline has passed. You can no longer submit.
        </p>
      )}
    </motion.div>
  );
};

export default AssignmentDetails;
