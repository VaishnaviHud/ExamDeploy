import React, { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

const SubmissionList = ({ submissions, assignmentId, refresh }) => {
  const [grades, setGrades] = useState({});
  const [search, setSearch] = useState("");
  const [filterUngraded, setFilterUngraded] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleGradeChange = (studentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (studentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/api/assignment/${assignmentId}/grade/${studentId}`,
        {
          marks: grades[studentId]?.marks,
          feedback: grades[studentId]?.feedback,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Grading saved");
      refresh();
    } catch (err) {
      toast.error("Failed to save grade");
    }
  };

  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];

    if (search.trim()) {
      result = result.filter((s) =>
        `${s.student?.name} ${s.student?.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (filterUngraded) {
      result = result.filter((s) => s.marks === undefined);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [submissions, search, filterUngraded, sortOrder]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mt-4">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search student..."
          className="border border-gray-300 p-2 rounded w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filterUngraded}
            onChange={() => {
              setFilterUngraded((prev) => !prev);
              setCurrentPage(1);
            }}
          />
          Show only ungraded
        </label>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
          className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
        >
          Sort: {sortOrder === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* List */}
      {paginatedSubmissions.length === 0 ? (
        <p className="text-sm text-gray-500">No submissions found.</p>
      ) : (
        <ul className="space-y-6 text-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer hover:bg-blue-50">
          {paginatedSubmissions.map((s, i) => (
            <li
              key={i}
              className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-3">
                <p className="font-semibold text-blue-800">
                  {s.student?.first_name} {s.student?.last_name}
                </p>
                <p className="text-gray-600 text-sm">{s.student?.email}</p>
              </div>

              <p className="mb-1 text-gray-700">
                <strong>Submitted:</strong>{" "}
                {new Date(s.submittedAt).toLocaleString()}
              </p>

              <p className="mb-3 text-gray-700">
                 <strong>File:</strong>{" "}
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View / Download
                </a>
              </p>

              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  placeholder="Marks"
                  className="border border-blue-300 bg-white p-2 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={grades[s.student._id]?.marks || s.marks || ""}
                  onChange={(e) =>
                    handleGradeChange(s.student._id, "marks", e.target.value)
                  }
                />
                <textarea
                  placeholder="Feedback"
                  className="border border-blue-300 bg-white p-2 rounded-md w-full h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={grades[s.student._id]?.feedback || s.feedback || ""}
                  onChange={(e) =>
                    handleGradeChange(s.student._id, "feedback", e.target.value)
                  }
                />
                <button
                  onClick={() => handleSubmit(s.student._id)}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium px-4 py-2 rounded hover:scale-105 hover:shadow-md transition-all"
                >
                  Save Grade
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1.5 rounded-full border transition-all ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-blue-600 hover:bg-blue-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
