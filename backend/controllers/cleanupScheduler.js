import cron from "node-cron";
import Seating from "../models/SeatingArrangement.js";
import Room from "../models/Room.js";
import Exam from "../models/Exam.js";

// Daily cleanup at 1:00 AM
cron.schedule("0 13 * * *", async () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // Get all expired seatings
    const expiredSeatings = await Seating.find()
      .populate({
        path: "exam_id",
        select: "exam_date",
      })
      .populate("room_id");

    for (const seating of expiredSeatings) {
      const examDate = new Date(seating.exam_id.exam_date).toISOString().split("T")[0];

      if (examDate < today) {
        // Remove exam from room.exams_scheduled
        const room = seating.room_id;
        room.exams_scheduled = room.exams_scheduled.filter(
          (eid) => eid.toString() !== seating.exam_id._id.toString()
        );
        await room.save();

        // Delete the seating arrangement
        await Seating.deleteOne({ _id: seating._id });
        console.log(`✅ Deleted expired seating for exam ${seating.exam_id._id}`);
      }
    }
  } catch (err) {
    console.error("❌ Error in seating cleanup:", err);
  }
});
