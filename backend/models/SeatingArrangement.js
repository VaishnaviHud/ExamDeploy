import mongoose from "mongoose";

const SeatingSchema = new mongoose.Schema({
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  seat_allocations: [
    {
      student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      seat_no: { type: String },
    },
  ],
});

const Seating = mongoose.model("Seating", SeatingSchema);
export default Seating;
