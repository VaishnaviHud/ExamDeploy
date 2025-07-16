import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import SubjectSidebar from "../../components/student/SubjectSidebar";
import SubjectCard from "../../components/student/SubjectCard";

const StudentSubjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get(
          `https://examdeploy.onrender.com/api/subjects/student/${user?.id}`
        );
        setSubjects(data);
        if (data.length) setSelected(data[0]);
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      }
    };
    if (user?.id) fetchSubjects();
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[80vh]">
      {/* Sidebar */}
      <SubjectSidebar
        subjects={subjects}
        selected={selected}
        onSelect={setSelected}
      />

      {/* Main Panel */}
      <div className="flex-1 p-6 transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          My Subjects
        </h2>
        {/* All subjects list */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            All Subjects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subj) => (
              <SubjectCard key={subj._id} subj={subj} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubjects;
