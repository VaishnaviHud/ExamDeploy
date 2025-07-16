import { useEffect, useState } from "react";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const [newSubject, setNewSubject] = useState({
    subject_id: "",
    subject_name: "",
    branch: "",
    semester: "",
    faculty_id: ""
  });

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/subjects/list");
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/subjects/teachers");
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      setAddingSubject(true);
      setAddError("");
      setAddSuccess("");

      const response = await fetch("http://localhost:4000/api/subjects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add subject");
      }

      setAddSuccess("Subject added successfully!");
      setNewSubject({
        subject_id: "",
        subject_name: "",
        branch: "",
        semester: "",
        faculty_id: ""
      });
      fetchSubjects();
      
      // Automatically close the form after successful addition
      setTimeout(() => {
        setShowAddForm(false);
        setAddSuccess("");
      }, 2000);
      
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingSubject(false);
    }
  };

  // Helper function to get teacher full name
  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t._id === teacherId);
    if (teacher) {
      return `${teacher.first_name} ${teacher.last_name}`;
    }
    return "Not assigned";
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-3xl font-bold text-indigo-700">Subject List</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showAddForm ? "Cancel" : "Add Subject"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Subject</h3>
          
          {addSuccess && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              {addSuccess}
            </div>
          )}
          
          {addError && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {addError}
            </div>
          )}
          
          <form onSubmit={handleAddSubject}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject ID</label>
                <input
                  type="text"
                  name="subject_id"
                  value={newSubject.subject_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  required
                  placeholder="e.g., CS101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  name="subject_name"
                  value={newSubject.subject_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  required
                  placeholder="e.g., Introduction to Programming"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={newSubject.branch}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  required
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input
                  type="number"
                  name="semester"
                  value={newSubject.semester}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  required
                  placeholder="e.g., 1"
                  min="1"
                  max="8"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                <select
                  name="faculty_id"
                  value={newSubject.faculty_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all bg-white"
                  required
                >
                  <option value="" disabled>Select a faculty member</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.first_name} {teacher.last_name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingSubject}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400"
              >
                {addingSubject ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Subject"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && subjects.length === 0 && (
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <p className="text-blue-700 text-lg">No subjects available</p>
        </div>
      )}

      {!loading && !error && subjects.length > 0 && (
        <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="p-4 font-semibold">Subject ID</th>
                <th className="p-4 font-semibold">Subject Name</th>
                <th className="p-4 font-semibold">Branch</th>
                <th className="p-4 font-semibold">Semester</th>
                <th className="p-4 font-semibold">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr 
                  key={subject._id} 
                  className={`text-gray-700 hover:bg-indigo-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-4 text-center font-medium text-indigo-700">{subject.subject_id}</td>
                  <td className="p-4">{subject.subject_name}</td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {subject.branch}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      {subject.semester}
                    </span>
                  </td>
                  <td className="p-4">
                    {subject.faculty_id ? (
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mr-2">
                          {subject.faculty_id.first_name?.[0]}{subject.faculty_id.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{subject.faculty_id.first_name} {subject.faculty_id.last_name}</p>
                          <p className="text-xs text-gray-500">{subject.faculty_id.email}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Not assigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;