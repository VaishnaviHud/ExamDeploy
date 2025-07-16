import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/exams", {
          params: {
            branch: user.branch,
            semester: user.semester,
          },
        });

        setExams(data);
      } catch (error) {
        console.error("Error fetching exams", error);
      }
    };

    if (user) fetchExams();
  }, [user]);

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        Upcoming Exams
      </h2>

      {exams.length === 0 ? (
        <p className="text-gray-500 text-lg">No exams scheduled.</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {exams.map((exam, idx) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-1">
                  {exam.subject_id?.subject_name || "Unknown Subject"}
                </h3>
                <p className="text-sm text-gray-700">
                  Date:{" "}
                  <span className="font-medium">
                    {new Date(exam.exam_date).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  Duration:{" "}
                  <span className="font-medium">{exam.duration} minutes</span>
                </p>
                <p className="text-sm text-gray-700">
                  Type: <span className="font-medium">{exam.exam_type}</span>
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default StudentDashboard;
