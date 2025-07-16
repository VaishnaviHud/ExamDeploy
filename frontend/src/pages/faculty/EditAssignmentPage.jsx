import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const EditAssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [referenceFile, setReferenceFile] = useState(null);
  const [existingFile, setExistingFile] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const { data } = await axios.get(`/api/assignment/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(data.title);
        setDescription(data.description);
        setDueDate(data.dueDate.split("T")[0]);
        setExistingFile(data.referenceFile || "");
      } catch {
        toast.error("Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dueDate", dueDate);
      if (referenceFile) formData.append("referenceFile", referenceFile);

      await axios.put(`/api/assignment/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assignment updated!");
      navigate(-1);
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-blue-600">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Loading assignment...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Edit Assignment</h2>
      <form
        onSubmit={handleUpdate}
        className="space-y-5 bg-white p-6 shadow-lg rounded-lg border"
      >
        <div>
          <label className="block font-medium text-sm mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Assignment Title"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded h-28 resize-y focus:ring-blue-500 focus:border-blue-500"
            placeholder="Description"
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {existingFile && (
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Current Reference File:
            </p>
            <a
              href={existingFile}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View Current File
            </a>
          </div>
        )}

        <div>
          <label className="block font-medium text-sm mb-1">
            Upload New Reference File
          </label>
          <input
            type="file"
            onChange={(e) => setReferenceFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
        >
          Update Assignment
        </button>
      </form>
    </motion.div>
  );
};

export default EditAssignmentPage;
