import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AssignmentDetails from "../../components/student/AssignmentDetails";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

const AssignmentDetailsPage = () => {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignment(data);
    } catch (err) {
      toast.error("Failed to fetch assignment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  return (
    <div className="p-6 min-h-[80vh] bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-48 text-blue-600">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Loading assignment...</span>
        </div>
      ) : assignment ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AssignmentDetails
            assignment={assignment}
            studentId={user?.id}
            refresh={fetchAssignment}
          />
        </motion.div>
      ) : (
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
          <AlertCircle className="w-5 h-5" />
          Assignment not found.
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailsPage;
