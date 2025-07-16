import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const TeacherProfile = () => {
  const { user } = useAuth();

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <motion.div
      className="p-4 sm:p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Teacher Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-sm font-medium text-gray-500">Teacher ID</p>
            <p className="text-purple-800">{user.teacher_id}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p>
              {user.first_name} {user.last_name}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Department</p>
            <p>{user.department}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherProfile;
