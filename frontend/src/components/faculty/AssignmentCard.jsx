import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MoreVertical } from "lucide-react";
const AssignmentCard = ({ assignment,  refreshAssignments }) => {
  const navigate = useNavigate();
  const isPastDeadline = new Date(assignment.dueDate) < new Date();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this assignment?"
    );
    if (!confirm) return;

      try {
        const token = localStorage.getItem("token");
      await axios.delete(`/api/assignment/${assignment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Assignment deleted");
      refreshAssignments(); // Refetch after deletion
    } catch {
      toast.error("Failed to delete assignment");
    }
  };

  return (
    <div className="relative bg-white border rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50">
      {/* Header + Menu */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          {assignment.title}
          {isPastDeadline ? (
            <span className="text-red-500 text-sm">❗</span>
          ) : (
            <span className="text-green-500 text-sm">✅</span>
          )}
        </h3>

        {/* Three Dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-gray-600 hover:text-black focus:outline-none"
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/assignment/edit/${assignment._id}`);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleDelete();
                }}
                className="block w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-2 line-clamp-2">
        {assignment.description}
      </p>
      <p className="text-sm">
        <strong>Due:</strong>{" "}
        <span className={isPastDeadline ? "text-red-600" : "text-green-600"}>
          {new Date(assignment.dueDate).toLocaleDateString()}
        </span>
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Assigned to: {assignment.assignedTo.length} students
      </p>

      {/* View submissions button */}
      <button
        onClick={() => navigate(`/assignment/${assignment._id}/submissions`)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-md text-sm transition duration-200"
      >
        View Submissions
      </button>
    </div>
  );
};

export default AssignmentCard;
