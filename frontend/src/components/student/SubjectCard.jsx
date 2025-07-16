import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const SubjectCard = ({ subj }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/student/subjects/${subj._id}`)}
      className="cursor-pointer group p-5 bg-white rounded-xl shadow-md border border-gray-200 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition" />
          {subj.subject_name}
        </div>
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {subj.subject_id} Sem {subj.semester}
        </span>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          Professor: {subj.faculty_id?.first_name}{" "}
          {subj.faculty_id?.last_name}
        </p>
      </div>
    </div>
  );
};

export default SubjectCard;
