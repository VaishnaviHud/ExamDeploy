import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const StudentProfile = () => {
  const { user } = useAuth();

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4">
          Student Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm md:text-base">
          <div>
            <p className="font-medium text-gray-500">Student ID</p>
            <p className="text-blue-800">{user.student_id}</p>
          </div>

          <div>
            <p className="font-medium text-gray-500">Full Name</p>
            <p>
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Branch</p>
            <p>{user.branch}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Semester</p>
            <p>{user.semester}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Email</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
