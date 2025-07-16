import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom"; // Added Routes and Route
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import RoomsList from "./RoomList";
import SubjectList from "./subjectList";
import ExamList from "./ExamPage";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, teachersRes] = await Promise.all([
          axios.get("https://examdeploy.onrender.com/api/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://examdeploy.onrender.com/api/teachers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStudents(studentsRes.data);
        setTeachers(teachersRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        // toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const verifyUser = async (id, type) => {
    setVerifying(id);
    try {
      await axios.put(
        `https://examdeploy.onrender.com/api/${type}/verify/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        `${type === "students" ? "Student" : "Teacher"} verified successfully!`
      );

      if (type === "students") {
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } else {
        setTeachers((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Verification failed", error);
      toast.error("Verification failed. Try again.");
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="p-5 border-b border-blue-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { to: "/admin-dashboard", label: "Dashboard" },
              { to: "/rooms", label: "Add Room" },
              { to: "/subjects", label: "Add Subject" },
              { to: "/exampage", label: "Add Exam" },
              { to: "/seating-arrangement", label: "Seating Arrangement" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block p-3 rounded-lg hover:bg-blue-700 transition-all"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <ToastContainer position="top-right" autoClose={2000} />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Students Section */}
              <section className="bg-white shadow rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Pending Students
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {students.length} Total
                  </span>
                </div>
                {students.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No pending students.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                      <div
                        key={student._id}
                        className="border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="bg-blue-50 p-3">
                          <h3 className="font-semibold text-gray-800 text-base">
                            {student.first_name} {student.last_name}
                          </h3>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Email:</span>{" "}
                            {student.email}
                          </p>
                          <button
                            onClick={() => verifyUser(student._id, "students")}
                            disabled={verifying === student._id}
                            className={`mt-3 w-full text-sm px-3 py-2 rounded-lg text-white font-medium transition ${
                              verifying === student._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {verifying === student._id ? (
                              <div className="flex justify-center items-center">
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                Verifying...
                              </div>
                            ) : (
                              "Verify"
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Teachers Section */}
              <section className="bg-white shadow rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Pending Teachers
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    {teachers.length} Total
                  </span>
                </div>
                {teachers.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No pending teachers.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="bg-green-50 p-3">
                          <h3 className="font-semibold text-gray-800 text-base">
                            {teacher.first_name} {teacher.last_name}
                          </h3>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Email:</span>{" "}
                            {teacher.email}
                          </p>
                          <button
                            onClick={() => verifyUser(teacher._id, "teachers")}
                            disabled={verifying === teacher._id}
                            className={`mt-3 w-full text-sm px-3 py-2 rounded-lg text-white font-medium transition ${
                              verifying === teacher._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {verifying === teacher._id ? (
                              <div className="flex justify-center items-center">
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                Verifying...
                              </div>
                            ) : (
                              "Verify"
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Routes */}
          <Routes>
            <Route path="/rooms" element={<RoomsList />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/exampage" element={<ExamList />} />
            <Route path="/seating-arrangement" element={<Navbar />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;