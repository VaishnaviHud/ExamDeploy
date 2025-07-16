import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AssignmentCard from "@/components/faculty/AssignmentCard";
const CreateAssignment = () => {
  const { user } = useAuth();
  const teacherId = user?.id;
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [referenceFile, setReferenceFile] = useState(null);
  const [assignedTo, setAssignedTo] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (teacherId) fetchSubjects();
  }, [teacherId]);

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(`/api/subjects/faculty/${teacherId}`);
      setSubjects(data);
    } catch {
      toast.error("Failed to load subjects");
    }
  };

  const handleSubjectChange = async (id) => {
    setSelectedSubjectId(id);
    try {
      const subjectRes = await axios.get(`/api/subjects/${id}`);
      const subject = subjectRes.data;
      setSelectedSubject(subject);

      const studentRes = await axios.get(
        `/api/students/filter?branch=${subject.branch}&semester=${subject.semester}`
      );
      setStudents(studentRes.data);
      setAssignedTo(studentRes.data.map((s) => s._id));

      const assignmentRes = await axios.get(`/api/assignment/subject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignments(assignmentRes.data);
    } catch {
      toast.error("Failed to load subject details");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId) return alert("Select a subject first");

    try {
      const formData = new FormData();
      formData.append("subject", selectedSubjectId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dueDate", dueDate);
      formData.append("assignedTo", JSON.stringify(assignedTo));
      if (referenceFile) {
        formData.append("referenceFile", referenceFile);
      }

      await axios.post("/api/assignment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assignment created!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setReferenceFile(null);
      setAssignedTo([]);
      handleSubjectChange(selectedSubjectId); // refresh assignments
    } catch (err) {
      toast.error("Failed to create assignment");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">
        Create Assignment
      </h2>

      {/* Subject Selection */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <label className="block mb-2 font-medium text-gray-700">
          Select Subject
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={selectedSubjectId}
          onChange={(e) => handleSubjectChange(e.target.value)}
        >
          <option value="">-- Choose Subject --</option>
          {subjects.map((subj) => (
            <option key={subj._id} value={subj._id}>
              {subj.subject_name} (Sem {subj.semester}, {subj.branch})
            </option>
          ))}
        </select>

        {selectedSubject && (
          <div className="mt-4 text-sm text-gray-700">
            <p>
              <strong>Subject:</strong> {selectedSubject.subject_name}
            </p>
            <p>
              <strong>Branch:</strong> {selectedSubject.branch}
            </p>
            <p>
              <strong>Semester:</strong> {selectedSubject.semester}
            </p>
            <p>
              <strong>Students:</strong> {students.length}
            </p>
          </div>
        )}
      </div>

      {/* Assignment Creation Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white shadow-lg p-6 rounded-lg mb-8 border"
      >
        <h3 className="text-xl font-semibold mb-4 text-blue-700">
          Assignment Details
        </h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 rounded mb-3"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg"
          onChange={(e) => setReferenceFile(e.target.files[0])}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-md transition"
        >
          Create Assignment
        </button>
      </form>

      {/* Assignment Cards */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner border">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Existing Assignments
        </h3>

        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments available.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assignments.map((a) => (
              <AssignmentCard key={a._id} assignment={a} refreshAssignments={() => handleSubjectChange(selectedSubjectId)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAssignment;
