import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    teacher_id: "",
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/teachers/register",
        formData
      );
      toast.success(res.data.message || "Teacher registered successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transition-all duration-500 ease-in-out transform hover:shadow-2xl hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Teacher Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Teacher ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teacher ID
            </label>
            <input
              type="text"
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-[1.02]"
            />
          </div>

          {/* First Name & Last Name Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-[1.02]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Other Fields */}
          {[
            { label: "Email", name: "email", type: "email" },
            { label: "Department", name: "department", type: "text" },
            { label: "Password", name: "password", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-[1.02]"
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 transform hover:scale-[1.05]"
          >
            Register
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/teacher-login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default TeacherRegister;
