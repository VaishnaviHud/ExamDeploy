// import express from "express";
// import Room from "../models/Room.js";

// const router = express.Router();


// router.post("/add-room", async (req, res) => {
//   try {
//     const { room_no, capacity } = req.body;

   
//     if (!room_no || !capacity) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newRoom = new Room({ room_no, capacity });
//     await newRoom.save();
//     res.status(201).json({ message: "Room added successfully", room: newRoom });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding room", error: error.message });
//   }
// });


// router.get("/rooms", async (req, res) => {
//   try {
//     const rooms = await Room.find().populate("exams_scheduled");
//     res.status(200).json(rooms);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching rooms", error: error.message });
//   }
// });

// export default router;
import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

// POST: Add new room
router.post("/add-room", async (req, res) => {
  try {
    const { room_no, capacity } = req.body;

    if (!room_no || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRoom = new Room({ room_no, capacity });
    await newRoom.save();

    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ message: "Error adding room", error: error.message });
  }
});

// GET: List all rooms with future exams only (with exam details)
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find().populate({
      path: "exams_scheduled",
      select: "exam_date exam_type subject_id", // Fields to return from Exam
      populate: {
        path: "subject_id",
        select: "name", // Only get the subject name
      },
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
});

export default router;
