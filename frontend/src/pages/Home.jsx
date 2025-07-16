import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-200 text-white p-6">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Welcome to ExamEase
        </h1>
        <p className="text-lg md:text-xl font-light">
          Empowering students, teachers, and administrators with seamless digital solutions.
        </p>
      </motion.div>

      {/* Show Logout Button if Logged In */}
      {user ? (
        <div className="flex flex-col items-center">
          <p className="text-lg">Logged in as <strong>{user.role}</strong></p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        // Cards Section for Register/Login
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Student Card */}
          <div className="group bg-white text-gray-900 p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <FaUserGraduate className="text-5xl text-blue-500 mb-4 mx-auto group-hover:text-indigo-600 transition" />
            <h2 className="text-2xl font-bold mb-3 text-center">Students</h2>
            <p className="text-center mb-4 text-gray-600">
              Access your dashboard, register for courses, and more.
            </p>
            <div className="flex flex-col items-center">
              <Link
                to="/student-register"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 hover:bg-blue-600 transition"
              >
                Register
              </Link>
              <Link
                to="/student-login"
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="group bg-white text-gray-900 p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <FaChalkboardTeacher className="text-5xl text-blue-500 mb-4 mx-auto group-hover:text-indigo-600 transition" />
            <h2 className="text-2xl font-bold mb-3 text-center">Teachers</h2>
            <p className="text-center mb-4 text-gray-600">
              Manage classes, interact with students, and track progress.
            </p>
            <div className="flex flex-col items-center">
              <Link
                to="/teacher-register"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 hover:bg-blue-600 transition"
              >
                Register
              </Link>
              <Link
                to="/teacher-login"
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="group bg-white text-gray-900 p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <FaUserShield className="text-5xl text-blue-500 mb-4 mx-auto group-hover:text-indigo-600 transition" />
            <h2 className="text-2xl font-bold mb-3 text-center">Admin</h2>
            <p className="text-center mb-4 text-gray-600">
              Oversee platform activity and verify users.
            </p>
            <div className="flex flex-col items-center">
              <Link
                to="/admin-register"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 hover:bg-blue-600 transition"
              >
                Register
              </Link>
              <Link
                to="/admin-login"
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
