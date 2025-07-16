import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddExam = () => {
  const [formData, setFormData] = useState({
    exam_id: "",
    subject_id: "",
    semester: "",
    exam_date: "",
    duration: "",
    exam_type: "Midterm",
    supervisors: [],
  });

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  // Fetch subjects and teachers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectRes = await axios.get("http://localhost:4000/api/subjects");
        const teacherRes = await axios.get("http://localhost:4000/api/teachers");

        setSubjects(subjectRes.data);
        setTeachers(teacherRes.data);
      } catch (error) {
        console.error("Error fetching subjects or teachers", error);
      }
    };

    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle supervisors selection (multiple selection)
  const handleSupervisorsChange = (e) => {
    const selectedSupervisors = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, supervisors: selectedSupervisors });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/exams/add", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Exam added successfully!");
      setTimeout(() => navigate("/admin-dashboard"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding exam.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add Exam</h2>

        <form onSubmit={handleSubmit}>
          {/* Exam ID */}
          <div className="mb-4">
            <input
              type="text"
              name="exam_id"
              placeholder="Exam ID"
              value={formData.exam_id}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Subject Selection */}
          <div className="mb-4">
            <select name="subject_id" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selection */}
          <div className="mb-4">
            <select name="semester" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Date */}
          <div className="mb-4">
            <input
              type="date"
              name="exam_date"
              value={formData.exam_date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g. 3 hours)"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Exam Type */}
          <div className="mb-4">
            <select name="exam_type" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Practical">Practical</option>
            </select>
          </div>

          {/* Supervisors Selection */}
          <div className="mb-4">
            <select multiple name="supervisors" onChange={handleSupervisorsChange} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Supervisors</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            <small className="text-gray-600">Hold Ctrl (Cmd on Mac) to select multiple supervisors</small>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700">
            Add Exam
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExam;
