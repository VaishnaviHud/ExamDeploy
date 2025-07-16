import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const StudentSeatingPage = () => {
  const { user } = useAuth();
  const [seatings, setSeatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSeating = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/seating/student/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter upcoming exams
      const today = new Date().setHours(0, 0, 0, 0);
      const upcoming = res.data.filter((s) => {
        const examDate = new Date(s.exam_date).setHours(0, 0, 0, 0);
        return examDate >= today;
      });
      setSeatings(upcoming);
    } catch (err) {
      toast.error("Failed to fetch seating data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchSeating();
  }, [user]);

  if (loading) {
    return (
      <motion.div
        className="p-6 text-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading seating info...
      </motion.div>
    );
  }

  if (seatings.length === 0) {
    return (
      <motion.div
        className="p-6 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No upcoming exams found.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 overflow-x-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Seating Arrangement
      </h2>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow">
        <thead className="bg-blue-50 text-blue-700">
          <tr>
            <th className="py-3 px-4 border-b">Subject</th>
            <th className="py-3 px-4 border-b">Exam Type</th>
            <th className="py-3 px-4 border-b">Exam Date</th>
            <th className="py-3 px-4 border-b">Room No.</th>
            <th className="py-3 px-4 border-b">Seat No.</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {seatings.map((s, idx) => (
              <motion.tr
                key={idx}
                className="hover:bg-gray-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <td className="py-2 px-4 border-b">
                  {s.subject} ({s.subject_id})
                </td>
                <td className="py-2 px-4 border-b">{s.exam_type}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(s.exam_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">{s.room.room_no}</td>
                <td className="py-2 px-4 border-b text-green-700 font-semibold">
                  {s.seat_no}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
};

export default StudentSeatingPage;
