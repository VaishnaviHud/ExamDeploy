import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  room_no: { type: String, unique: true, required: true },
  capacity: { type: Number, required: true },
  exams_scheduled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }],
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
