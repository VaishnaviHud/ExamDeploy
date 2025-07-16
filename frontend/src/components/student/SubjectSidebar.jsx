import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

const SubjectSidebar = ({ subjects, selected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white border-r shadow-md transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-14"
      } h-full fixed md:static z-50`}
    >
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between p-3 border-b bg-blue-50">
        {isOpen && (
          <h3 className="text-lg font-semibold text-blue-800">My Subjects</h3>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Subject List */}
      {isOpen && (
        <ul className="p-3 space-y-2">
          {subjects.map((s) => (
            <li
              key={s._id}
              onClick={() => navigate(`/student/subjects/${s._id}`)}
              className={`cursor-pointer px-3 py-2 rounded-lg ${
                selected?._id === s._id
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {s.subject_name}
              <span className="ml-2 text-sm text-gray-500">
                (Sem {s.semester})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubjectSidebar;
