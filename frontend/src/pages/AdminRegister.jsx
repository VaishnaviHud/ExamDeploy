import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    admin_id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/admin/register",
        formData
      );
      toast.success(data.message || "Admin registered successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong!");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transition-all duration-500 ease-in-out transform hover:shadow-2xl hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Admin Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Admin ID</label>
            <input
              type="text"
              name="admin_id"
              value={formData.admin_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-gray-600 text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/admin-login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AdminRegister;
