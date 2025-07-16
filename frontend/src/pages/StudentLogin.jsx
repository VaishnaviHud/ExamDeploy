import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { jwtDecode } from "jwt-decode";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth(); // Use login function from AuthContext
  const navigate = useNavigate(); // Navigation hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/students/login",
        formData
      );
      
      const token = data.token;
      localStorage.setItem("token", token);
      login(token); // Update AuthContext state

      const decodedUser = jwtDecode(token);
      if (decodedUser.role === "student") {
        navigate("/"); // Redirect to Student Dashboard
      } else {
        navigate("/"); // Fallback
      }

      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center transform transition duration-300 hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Login</h2>

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>

        {/* Forgot Password & Register Links */}
        <div className="mt-4">
          <p className="text-gray-600 text-sm mt-2">
            Don't have an account?{" "}
            <a
              href="/student-register"
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
