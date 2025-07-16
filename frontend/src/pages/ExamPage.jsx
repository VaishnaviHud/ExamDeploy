
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExamList = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: "",
    exam_date: "",
    duration: "",
    exam_type: "",
    supervisors: [],
  });

  useEffect(() => {
    // Fetch exams
    axios.get("http://localhost:4000/api/exams/all")
      .then((response) => {
        setExams(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching exams:", error);
      });

    // Fetch subjects
    axios.get("http://localhost:4000/api/exams/subjects/all")
      .then((response) => {
        setSubjects(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });

    // Fetch teachers
    axios.get("http://localhost:4000/api/exams/teachers/all")
      .then((response) => {
        const teachersData = response.data && Array.isArray(response.data) ? response.data : [];
        setTeachers(teachersData);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSupervisorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, supervisors: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/exams/create", formData);
      alert("Exam created successfully!");
      setShowForm(false);
      // Refresh exams
      const updatedExams = await axios.get("http://localhost:4000/api/exams/all");
      setExams(Array.isArray(updatedExams.data) ? updatedExams.data : []);
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Failed to create exam");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">Exam List</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md flex items-center"
          >
            <span className="mr-1 text-xl"></span> Add Exam
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Exam</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                  <select 
                    name="subject_id" 
                    value={formData.subject_id} 
                    onChange={handleChange} 
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subject_name} ({subject.branch} - Sem {subject.semester})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date:</label>
                  <input 
                    type="date" 
                    name="exam_date" 
                    value={formData.exam_date} 
                    onChange={handleChange} 
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes):</label>
                  <input 
                    type="number" 
                    name="duration" 
                    value={formData.duration} 
                    onChange={handleChange} 
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type:</label>
                  <select 
                    name="exam_type" 
                    value={formData.exam_type} 
                    onChange={handleChange} 
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>
              </div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Supervisors:</label>
  <select 
    name="supervisors" 
    value={formData.supervisors} 
    onChange={handleSupervisorChange} 
    required
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="">Select Supervisor</option>
    {teachers.map((teacher) => (
      <option key={teacher._id} value={teacher._id}>
        {teacher.first_name} {teacher.last_name} ({teacher.department})
      </option>
    ))}
  </select>
</div>


              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
        
    <table className="min-w-full bg-white rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-indigo-600 text-white text-left">
          <th className="py-3 px-4 font-semibold">Exam ID</th>
          <th className="py-3 px-4 font-semibold">Subject</th>
          <th className="py-3 px-4 font-semibold">Branch</th>
          <th className="py-3 px-4 font-semibold">Semester</th>
          <th className="py-3 px-4 font-semibold">Date</th>
          <th className="py-3 px-4 font-semibold">Type</th>
          {/* <th className="py-3 px-4 font-semibold">Actions</th> */}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <tr key={exam._id} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-indigo-600 font-medium">
                {exam.exam_id}
              </td>
              <td className="py-3 px-4">
                {exam.subject_id?.subject_name || "N/A"}
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {exam.subject_id?.branch || "N/A"}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {exam.subject_id?.semester || "N/A"}
                </span>
              </td>
              <td className="py-3 px-4">{formatDate(exam.exam_date)}</td>
              <td className="py-3 px-4">{exam.exam_type}</td>
              <td className="py-3 px-4">
                {/* <button className="text-indigo-600 hover:text-indigo-800 mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button> */}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="py-6 text-center text-gray-500">
              No exams found. Click "Add Exam" to create one.
            </td>
          </tr>
        )}
      </tbody>
    </table>
        </div>
      </div>
    </div>
  );
};

export default ExamList;