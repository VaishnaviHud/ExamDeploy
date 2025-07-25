import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { jwtDecode } from "jwt-decode";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://examdeploy.onrender.com/api/teachers/login",
        formData
      );

      const token = data.token;
      localStorage.setItem("token", token);
      login(token); // Save token & update auth state

      const decodedUser = jwtDecode(token);
      if (decodedUser.role === "teacher") {
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Unauthorized access!");
        localStorage.removeItem("token");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center transform transition duration-300 hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Teacher Login</h2>

        <form onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Navigate to register page using useNavigate */}
        <div className="mt-4">
          <p className="text-gray-600 text-sm mt-2">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/teacher-register")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
