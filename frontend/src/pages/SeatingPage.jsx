// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const SeatingPage = () => {
//   const [exams, setExams] = useState([]);
//   const [selectedExam, setSelectedExam] = useState("");
//   const [numRooms, setNumRooms] = useState("");
//   const [seatsPerRoom, setSeatsPerRoom] = useState("");
//   const [numStudents, setNumStudents] = useState("");
//   const [seatingData, setSeatingData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch available exams
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/exams") // Replace with your backend API
//       .then((response) => setExams(response.data))
//       .catch((error) => console.error("Error fetching exams:", error));
//   }, []);

//   // Handle seating allocation
//   const generateSeating = async () => {
//     if (!selectedExam || !numRooms || !seatsPerRoom || !numStudents) {
//       alert("Please fill in all fields!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/api/seating/allocate", {
//         exam_id: selectedExam,
//         rooms: Number(numRooms),
//         seats_per_room: Number(seatsPerRoom),
//         total_students: Number(numStudents),
//       });

//       setSeatingData(response.data.seatAllocations);
//     } catch (error) {
//       console.error("Error generating seating:", error);
//       alert("Failed to generate seating");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-lg">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Automatic Seating Arrangement</h1>

//         {/* Exam Selection */}
//         <select
//           className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//           onChange={(e) => setSelectedExam(e.target.value)}
//         >
//           <option value="">Select an Exam</option>
//           {exams.map((exam) => (
//             <option key={exam._id} value={exam._id}>
//               {exam.name}
//             </option>
//           ))}
//         </select>

//         {/* Input Fields */}
//         <input
//           type="number"
//           placeholder="Number of Rooms"
//           value={numRooms}
//           onChange={(e) => setNumRooms(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//         />
//         <input
//           type="number"
//           placeholder="Seats per Room"
//           value={seatsPerRoom}
//           onChange={(e) => setSeatsPerRoom(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//         />
//         <input
//           type="number"
//           placeholder="Number of Students"
//           value={numStudents}
//           onChange={(e) => setNumStudents(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//         />

//         {/* Generate Seating Button */}
//         <button
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
//           onClick={generateSeating}
//           disabled={loading}
//         >
//           {loading ? "Generating..." : "Generate Seating"}
//         </button>

//         {/* Display Seating Arrangement */}
//         {seatingData && (
//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-3">Seating Arrangement</h2>
//             {seatingData.map((room, index) => (
//               <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
//                 <h3 className="text-lg font-bold text-gray-700 mb-2">Room: {room.room_id}</h3>
//                 <table className="w-full border-collapse border border-gray-300">
//                   <thead className="bg-gray-200">
//                     <tr>
//                       <th className="border p-2">Seat No</th>
//                       <th className="border p-2">Student ID</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {room.allocations.map((seat, idx) => (
//                       <tr key={idx} className="text-center">
//                         <td className="border p-2">{seat.seat_no}</td>
//                         <td className="border p-2">{seat.student_id}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SeatingPage;
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SeatingPage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [seatingData, setSeatingData] = useState([]);
  const [seatingLoading, setSeatingLoading] = useState(false);

  // Load all exams
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/exams/all")
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Failed to load exams", err));
  }, []);

  // Load all seating data
  const fetchSeating = async () => {
    try {
      setSeatingLoading(true);
      const res = await axios.get("http://localhost:4000/api/seating/all");
      setSeatingData(res.data);
    } catch (err) {
      console.error("Failed to load seating data", err);
    } finally {
      setSeatingLoading(false);
    }
  };

  useEffect(() => {
    fetchSeating();
  }, []);

  const handleGenerate = async () => {
    if (!selectedExam) {
      setMessage("Please select an exam.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/seating/generate-seating", {
        exam_id: selectedExam,
      });
      setMessage(res.data.message);
      fetchSeating(); // Refresh the table
    } catch (error) {
      setMessage(error.response?.data?.message || "Error generating seating.");
    } finally {
      setLoading(false);
    }
  };

  // Group seating by exam
  const groupedSeating = seatingData.reduce((acc, seat) => {
    const examId = seat.exam_id?._id;
    if (!acc[examId]) {
      acc[examId] = {
        exam: seat.exam_id,
        rooms: [],
      };
    }
    acc[examId].rooms.push(seat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Generate Seating Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl mx-auto mb-12 transition-all duration-300">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Generate Seating Arrangement
          </h1>

          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Select an Exam --</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.subject_id?.subject_name || "Unnamed Subject"} - {exam.exam_type} –{" "}
                {new Date(exam.exam_date).toLocaleDateString()}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Seating Arrangement"}
          </button>

          {message && (
            <div className="mt-6 text-center text-sm text-gray-800 bg-indigo-50 border border-indigo-200 p-3 rounded-lg">
              {message}
            </div>
          )}
        </div>

        {/* Seating Display Section */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            All Seating Arrangements
          </h2>

          {seatingLoading ? (
            <p className="text-center text-gray-500">Loading seating data...</p>
          ) : Object.keys(groupedSeating).length === 0 ? (
            <p className="text-center text-gray-500">No seating arrangements found.</p>
          ) : (
            Object.values(groupedSeating).map(({ exam, rooms }, idx) => (
              <div key={idx} className="mb-10 border-t pt-6">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                  {exam?.subject_id?.subject_name || "Unnamed Subject"} – {exam.exam_type} –{" "}
                  {new Date(exam?.exam_date).toLocaleDateString()}
                </h3>

                {rooms.map((room, i) => (
                  <div
                    key={i}
                    className="mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50"
                  >
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      Room: {room.room_id?.room_no || "Unknown"}
                    </h4>
                    <table className="w-full border-collapse border text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border px-3 py-1">Seat No</th>
                          <th className="border px-3 py-1">Student Name</th>
                          <th className="border px-3 py-1">Student ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {room.seat_allocations.map((seat, j) => (
                          <tr key={j}>
                            <td className="border px-3 py-1">{seat.seat_no}</td>
                            <td className="border px-3 py-1">
                              {seat.student_id
                                ? `${seat.student_id.first_name} ${seat.student_id.last_name}`
                                : "N/A"}
                            </td>
                            <td className="border px-3 py-1">
                              {seat.student_id?.student_id}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
