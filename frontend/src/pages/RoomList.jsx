import { useEffect, useState } from "react";

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_no: "", capacity: "" });
  const [addingRoom, setAddingRoom] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/rooms/rooms");
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      setAddingRoom(true);
      setAddError("");
      setAddSuccess("");

      const response = await fetch("http://localhost:4000/api/rooms/add-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add room");
      }

      setAddSuccess("Room added successfully!");
      setNewRoom({ room_no: "", capacity: "" });
      fetchRooms();
      
     
      setTimeout(() => {
        setShowAddForm(false);
        setAddSuccess("");
      }, 2000);
      
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingRoom(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-3xl font-bold text-indigo-700">Room List</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showAddForm ? "Cancel" : "Add Room"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Room</h3>
          
          {addSuccess && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              {addSuccess}
            </div>
          )}
          
          {addError && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {addError}
            </div>
          )}
          
          <form onSubmit={handleAddRoom}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  name="room_no"
                  value={newRoom.room_no}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  required
                  placeholder="e.g., A101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={newRoom.capacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition-all"
                  required
                  placeholder="e.g., 50"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingRoom}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400"
              >
                {addingRoom ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Room"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <p className="text-blue-700 text-lg">No rooms available</p>
        </div>
      )}

      {!loading && !error && rooms.length > 0 && (
        <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="p-4 font-semibold">Room No</th>
                <th className="p-4 font-semibold">Capacity</th>
                {/* <th className="p-4 font-semibold">Exams Scheduled</th> */}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr 
                  key={room._id} 
                  className={`text-gray-700 hover:bg-indigo-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-4 text-center font-medium text-indigo-700">{room.room_no}</td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {room.capacity} seats
                    </span>
                  </td>
                  {/* <td className="p-4 text-center">
                    {room.exams_scheduled && room.exams_scheduled.length > 0 ? (
                      <div className="space-y-1">
                        {room.exams_scheduled && room.exams_scheduled.length > 0 ? (
  <div className="space-y-1">
    {room.exams_scheduled
      .filter((exam) => new Date(exam.exam_date) >= new Date()) // ✅ only future or today's exams
      .map((exam, i) => (
        <span
          key={i}
          className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full m-1"
        >
          {exam.exam_type || 'Exam'} -{" "}
          {new Date(exam.exam_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ))}
  </div>
) : (
  <span className="text-gray-500 italic">No upcoming exams</span>
)}

                      </div>
                    ) : (
                      <span className="text-gray-500 italic">No exams scheduled</span>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoomsList;