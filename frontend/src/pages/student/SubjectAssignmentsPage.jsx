import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Filter, SortAsc, SortDesc } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 6;

const SubjectAssignmentsPage = () => {
  const { subjectId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | completed
  const [sort, setSort] = useState("asc"); // asc | desc
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/assignment/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    };
    fetch();
  }, [subjectId]);

  const getDeadlineColor = (dueDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const due = new Date(dueDate).setHours(0, 0, 0, 0);
    if (due < today) return "text-red-600";
    if (due === today) return "text-yellow-500";
    return "text-green-600";
  };

  // Filter
  const filteredAssignments = assignments.filter((a) => {
    const hasSubmitted = a.submissions?.some((s) => s.student?._id === user.id);

    if (filter === "pending") return !hasSubmitted;
    if (filter === "completed") return hasSubmitted;
    return true;
  });
  
  

  // Sort
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sort === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const totalPages = Math.ceil(sortedAssignments.length / ITEMS_PER_PAGE);
  const paginatedAssignments = sortedAssignments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-3xl font-bold text-blue-800">📚 Assignments</h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter */}
          <div className="flex items-center gap-1 ">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <button
            onClick={() => {
              setSort((prev) => (prev === "asc" ? "desc" : "asc"));
              setCurrentPage(1);
            }}
            className="flex items-center gap-1 text-sm border px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            {sort === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
            {sort === "asc" ? "Earliest First" : "Latest First"}
          </button>
        </div>
      </div>

      {/* Cards */}
      {paginatedAssignments.length === 0 ? (
        <p className="text-gray-600">No assignments found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 ">
          {paginatedAssignments.map((a) => (
            <Link
              to={`/student/assignments/${a._id}`}
              key={a._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition duration-300 group"
            >
              <h4 className="text-lg font-semibold text-blue-700 group-hover:underline mb-1">
                {a.title}
              </h4>
              <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                {a.description.slice(0, 100)}...
              </p>
              <div className="flex items-center gap-2 text-xs">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span className={`font-medium ${getDeadlineColor(a.dueDate)}`}>
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700"
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

export default SubjectAssignmentsPage;
