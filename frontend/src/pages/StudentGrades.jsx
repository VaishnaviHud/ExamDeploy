import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); 

 useEffect(() => {
  

  const fetchGrades = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login again.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:4000/api/students/grades", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGrades(res.data);
    } catch (err) {
      console.error("Grades Fetch Error:", err);
      setError("Failed to load grades. " + (err.response?.data?.message || ""));
    }
  };

  fetchGrades();
}, []);


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Grades</h2>

      {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

      {!error && grades.length === 0 && (
        <p className="text-gray-600">No grades available.</p>
      )}

      {grades.length > 0 && (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Grade</th>
              <th className="border px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade._id}>
                <td className="border px-4 py-2">
                  {grade.subject_id?.subject_name || "Unknown Subject"}
                </td>
                <td className="border px-4 py-2">{grade.grade}</td>
                <td className="border px-4 py-2">{grade.averageScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentGrades;
