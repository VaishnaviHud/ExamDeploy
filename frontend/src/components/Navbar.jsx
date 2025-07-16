import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // Hamburger icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const [role, setRole] = useState(user?.role || null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(() => {
      navigate("/");
    });
  };

  useEffect(() => {
    setRole(user?.role);
  }, [user]);

  const navLinks = (
    <>
      <Link to="/" className="hover:text-gray-300 transition">Home</Link>

      {role === "admin" && (
        <Link to="/admin-dashboard" className="hover:text-gray-300 transition">Dashboard</Link>
      )}

      {role === "teacher" && (
        <>
          <Link to="/teacher-profile" className="hover:text-gray-300 transition">Profile</Link>
          <Link to="/grade-students" className="hover:text-gray-300 transition">Grade Students</Link>
          <Link to="/create-assignment" className="hover:text-gray-300 transition">Create Assignments</Link>
        </>
      )}

      {role === "student" && (
        <>
          <Link to="/student-profile" className="hover:text-gray-300 transition">Profile</Link>
          <Link to="/student-dashboard" className="hover:text-gray-300 transition">Exams</Link>
          <Link to="/student/subjects" className="hover:text-gray-300 transition">Assignments</Link>
          <Link to="/student/grades" className="hover:text-gray-300 transition">View Grades</Link>
          <Link to="/student/seating" className="hover:text-gray-300 transition">Seating</Link>
        </>
      )}

      <Link to="/about" className="hover:text-gray-300 transition">About</Link>
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          <Link to="/" className="hover:text-gray-300">ExamEase</Link>
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks}
          {/* {user && (
            // <button
            //   onClick={handleLogout}
            //   className="ml-4 px-3 py-1 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
            // >
            //   Logout
            // </button>
          )} */}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden flex flex-col gap-4 mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks}
            {/* {user && (
              // <button
              //   onClick={handleLogout}
              //   className="text-left mt-2 px-3 py-1 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
              // >
              //   Logout
              // </button>
            )} */}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
