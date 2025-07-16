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
          axios.get("http://localhost:4000/api/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/api/teachers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStudents(studentsRes.data);
        setTeachers(teachersRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load data.");
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
        `http://localhost:4000/api/${type}/verify/${id}`,
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="p-5 border-b border-blue-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/admin-dashboard" className="flex items-center p-3 text-white rounded-lg hover:bg-blue-700 transition-all">
                <span className="ml-2">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="flex items-center p-3 text-white rounded-lg hover:bg-blue-700 transition-all">
                <span className="ml-2">Add Room</span>
              </Link>
            </li>
            <li>
              <Link to="/subjects" className="flex items-center p-3 text-white rounded-lg hover:bg-blue-700 transition-all">
                <span className="ml-2">Add Subject</span>
              </Link>
            </li>
            <li>
              <Link to="/exampage" className="flex items-center p-3 text-white rounded-lg hover:bg-blue-700 transition-all">
                <span className="ml-2">Add Exam</span>
              </Link>
            </li>
            <li>
              <Link to="/seating-arrangement" className="flex items-center p-3 text-white rounded-lg hover:bg-blue-700 transition-all">
                <span className="ml-2">Seating Arrangement</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          <ToastContainer position="top-right" autoClose={2000} />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Add New Exam Button */}
              <div className="mb-6 text-center">
                <Link
                  to="exampage"
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
                >
                  Add New Exam
                </Link>
              </div>

              {/* Students Section */}
              <section className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pending Students
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {students.length} Total
                  </span>
                </div>
                
                {students.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">No pending students.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                      <div
                        key={student._id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="bg-blue-50 p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {student.first_name} {student.last_name}
                          </h3>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Email:</span> {student.email}
                          </p>
                          <button
                            onClick={() => verifyUser(student._id, "students")}
                            className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
                              verifying === student._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            disabled={verifying === student._id}
                          >
                            {verifying === student._id ? (
                              <span className="flex items-center justify-center">
                                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                Verifying...
                              </span>
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
              <section className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pending Teachers
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    {teachers.length} Total
                  </span>
                </div>

                {teachers.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">No pending teachers at this time.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="bg-green-50 p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {teacher.first_name} {teacher.last_name}
                          </h3>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Email:</span> {teacher.email}
                          </p>
                          <button
                            onClick={() => verifyUser(teacher._id, "teachers")}
                            className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors ${
                              verifying === teacher._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                            disabled={verifying === teacher._id}
                          >
                            {verifying === teacher._id ? (
                              <span className="flex items-center justify-center">
                                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                Verifying...
                              </span>
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
            </>
          )}

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