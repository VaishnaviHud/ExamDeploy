import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubmissionList from "@/components/faculty/SubmissionList";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";

const AssignmentSubmissionsPage = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAssignment = async () => {
    try {
      const { data } = await axios.get(`/api/assignment/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignment(data);
    } catch (err) {
      toast.error("Failed to load assignment");
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  if (!assignment)
    return (
      <div className="p-6 flex justify-center">
        <p className="text-gray-600 text-sm animate-pulse">
          Loading assignment...
        </p>
      </div>
    );

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Assignment Header Card */}
      <motion.div
        className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 p-6 rounded-2xl shadow-lg mb-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-3 flex items-center gap-2">
          {assignment.title}
        </h2>
        <p className="text-gray-800 mb-3 text-md leading-relaxed">
          {assignment.description}
        </p>

        <div className="text-sm text-blue-700 font-medium mb-3">
          <strong>Due Date:</strong>{" "}
          {new Date(assignment.dueDate).toLocaleDateString()}
        </div>

        {assignment.referenceFileUrl && (
          <div className="mt-3 flex items-center gap-2 text-sm text-blue-700">
            <FiFileText size={18} />
            <a
              href={assignment.referenceFileUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-blue-900 transition"
            >
              View Attached File
            </a>
          </div>
        )}
      </motion.div>

      {/* Submission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-semibold text-blue-700 mb-5 flex items-center gap-2">
          Submissions
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
            {assignment.submissions?.length || 0}
          </span>
        </h3>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <SubmissionList
            submissions={assignment.submissions}
            assignmentId={assignment._id}
            refresh={fetchAssignment}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssignmentSubmissionsPage;
