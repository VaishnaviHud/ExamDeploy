import Exam from "../models/Exam.js";
import Room from "../models/Room.js";

import Student from "../models/Student.js";

import Seating from "../models/SeatingArrangement.js";
// // export const generateSeatingArrangement = async (req, res) => {
// //   try {
// //     const { exam_id } = req.body;

// //     // Step 1: Find Exam
// //     const exam = await Exam.findById(exam_id).populate("students_registered");
// //     if (!exam) return res.status(404).json({ message: "Exam not found" });

// //     // Step 1.5: Check if seating already exists
// //     const existingArrangement = await Seating.findOne({ exam_id });
// //     if (existingArrangement) {
// //       return res.status(400).json({ message: "Seating arrangement already exists for this exam." });
// //     }

// //     const students = exam.students_registered;
// //     const totalStudents = students.length;

// //     // Step 2: Get all available rooms sorted by capacity
// //     const rooms = await Room.find({}).sort({ capacity: -1 });
// //     if (rooms.length === 0) return res.status(400).json({ message: "No rooms available" });

// //     let studentIndex = 0;
// //     const arrangements = [];

// //     for (const room of rooms) {
// //       if (studentIndex >= totalStudents) break;

// //       const seatAllocations = [];
// //       const roomCapacity = room.capacity;

// //       for (let i = 0; i < roomCapacity && studentIndex < totalStudents; i++, studentIndex++) {
// //         seatAllocations.push({
// //           student_id: students[studentIndex]._id,
// //           seat_no: `S${i + 1}`,
// //         });
// //       }

// //       const seating = new Seating({
// //         exam_id: exam._id,
// //         room_id: room._id,
// //         seat_allocations: seatAllocations,
// //       });
// //       await seating.save();
// //       arrangements.push(seating);
// //     }

// //     if (studentIndex < totalStudents) {
// //       return res.status(400).json({
// //         message: `Only ${studentIndex} out of ${totalStudents} students were accommodated. Not enough rooms.`,
// //       });
// //     }

// //     res.status(200).json({
// //       message: "Seating arrangement generated successfully",
// //       arrangements,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// export const generateSeatingArrangement = async (req, res) => {
//   try {
//     const { exam_id } = req.body;

//     const exam = await Exam.findById(exam_id).populate("students_registered");
//     if (!exam) return res.status(404).json({ message: "Exam not found" });

//     const existingArrangement = await Seating.findOne({ exam_id });
//     if (existingArrangement) {
//       return res.status(400).json({ message: "Seating arrangement already exists for this exam." });
//     }

//     const students = exam.students_registered;
//     const totalStudents = students.length;

//     const rooms = await Room.find({}).sort({ capacity: -1 });
//     if (rooms.length === 0) return res.status(400).json({ message: "No rooms available" });

//     let studentIndex = 0;
//     const arrangements = [];

//     for (const room of rooms) {
//       if (studentIndex >= totalStudents) break;

//       const isRoomOccupied = room.exams_scheduled.includes(exam_id);
//       if (isRoomOccupied) continue;

//       const seatAllocations = [];
//       const roomCapacity = room.capacity;

//       for (let i = 0; i < roomCapacity && studentIndex < totalStudents; i++, studentIndex++) {
//         seatAllocations.push({
//           student_id: students[studentIndex]._id,
//           seat_no: `S${i + 1}`,
//         });
//       }

//       const seating = new Seating({
//         exam_id: exam._id,
//         room_id: room._id,
//         seat_allocations: seatAllocations,
//       });

//       await seating.save();
//       arrangements.push(seating);

//       room.exams_scheduled.push(exam._id);
//       await room.save();
//     }

//     if (studentIndex < totalStudents) {
//       return res.status(400).json({
//         message: `Only ${studentIndex} out of ${totalStudents} students were accommodated. Not enough available rooms.`,
//       });
//     }

//     res.status(200).json({
//       message: "Seating arrangement generated successfully",
//       arrangements,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getAllSeatingArrangements = async (req, res) => {
  try {
    const seatings = await Seating.find()
      .populate({
        path: "exam_id",
        populate: {
          path: "subject_id",
          model: "Subject",
        },
      })
      .populate("room_id")
      .populate("seat_allocations.student_id");

    res.status(200).json(seatings);
  } catch (error) {
    console.error("Error fetching all seating arrangements:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const generateSeatingArrangement = async (req, res) => {
//   const { exam_id } = req.body;

//   if (!exam_id) return res.status(400).json({ message: "Exam ID is required." });

//   try {
//     const exam = await Exam.findById(exam_id)
//       .populate("students_registered")
//       .populate("subject_id");

//     if (!exam) return res.status(404).json({ message: "Exam not found." });

//     // Check if seating already exists for this exam
//     const existing = await Seating.findOne({ exam_id });
//     if (existing)
//       return res.status(400).json({ message: "Seating arrangement already exists for this exam." });

//     const examDate = new Date(exam.exam_date).toISOString().split("T")[0];

//     // Find available rooms not already scheduled for this date
//     const rooms = await Room.find({}).populate("exams_scheduled");

//     const availableRooms = rooms.filter((room) =>
//       room.exams_scheduled.every((ex) => {
//         const ed = new Date(ex.exam_date).toISOString().split("T")[0];
//         return ed !== examDate;
//       })
//     );

//     if (availableRooms.length === 0) {
//       return res.status(400).json({ message: "No available rooms for this exam date." });
//     }

//     // Filter verified students
//     const students = exam.students_registered.filter((s) => s.isVerified);
//     const totalStudents = students.length;

//     if (totalStudents === 0) {
//       return res.status(400).json({ message: "No verified students registered for this exam." });
//     }

//     // Sort students for consistent seat allocation
//     students.sort((a, b) => a.student_id.localeCompare(b.student_id));

//     // Room Allocation Logic
//     const seatings = [];
//     let studentIndex = 0;

//     for (const room of availableRooms) {
//       if (studentIndex >= totalStudents) break;

//       const capacity = room.capacity;
//       const seatsToAssign = Math.min(capacity, totalStudents - studentIndex);

//       const seat_allocations = [];

//       for (let i = 0; i < seatsToAssign; i++) {
//         seat_allocations.push({
//           student_id: students[studentIndex]._id,
//           seat_no: `S${i + 1}`,
//         });
//         studentIndex++;
//       }

//       const newSeating = new Seating({
//         exam_id: exam._id,
//         room_id: room._id,
//         seat_allocations,
//       });

//       await newSeating.save();
//       seatings.push(newSeating);

//       // Add exam to room's scheduled list
//       room.exams_scheduled.push(exam._id);
//       await room.save();
//     }

//     if (studentIndex < totalStudents) {
//       return res.status(400).json({
//         message: "Not enough rooms to accommodate all students.",
//         partial: true,
//         allocated: studentIndex,
//         total: totalStudents,
//       });
//     }

//     return res.status(201).json({
//       message: "Seating arrangement generated successfully.",
//       seatings,
//     });
//   } catch (error) {
//     console.error("Seating Generation Error:", error);
//     res.status(500).json({ message: "Server error during seating generation." });
//   }
// };
export const generateSeatingArrangement = async (req, res) => {
  const { exam_id } = req.body;

  if (!exam_id)
    return res.status(400).json({ message: "Exam ID is required." });

  try {
    const exam = await Exam.findById(exam_id).populate("subject_id");

    if (!exam) return res.status(404).json({ message: "Exam not found." });

    // Check if seating already exists for this exam
    const existing = await Seating.findOne({ exam_id });
    if (existing)
      return res
        .status(400)
        .json({ message: "Seating arrangement already exists for this exam." });

    const examDate = new Date(exam.exam_date).toISOString().split("T")[0];

    // Find available rooms not already scheduled for this date
    const rooms = await Room.find({}).populate("exams_scheduled");

    const availableRooms = rooms.filter((room) =>
      room.exams_scheduled.every((ex) => {
        const ed = new Date(ex.exam_date).toISOString().split("T")[0];
        return ed !== examDate;
      })
    );

    if (availableRooms.length === 0) {
      return res
        .status(400)
        .json({ message: "No available rooms for this exam date." });
    }

    // ✅ Get students by branch and semester
    const students = await Student.find({
      branch: exam.subject_id.branch, // OR use exam.branch if available
      semester: exam.semester,
      isVerified: true,
    });

    const totalStudents = students.length;

    if (totalStudents === 0) {
      return res
        .status(400)
        .json({
          message: "No verified students found for this branch and semester.",
        });
    }

    // Sort students for consistent seat allocation
    students.sort((a, b) => a.student_id.localeCompare(b.student_id));

    // Room Allocation Logic
    const seatings = [];
    let studentIndex = 0;

    for (const room of availableRooms) {
      if (studentIndex >= totalStudents) break;

      const capacity = room.capacity;
      const seatsToAssign = Math.min(capacity, totalStudents - studentIndex);

      const seat_allocations = [];

      for (let i = 0; i < seatsToAssign; i++) {
        seat_allocations.push({
          student_id: students[studentIndex]._id,
          seat_no: `S${i + 1}`,
        });
        studentIndex++;
      }

      const newSeating = new Seating({
        exam_id: exam._id,
        room_id: room._id,
        seat_allocations,
      });

      await newSeating.save();
      seatings.push(newSeating);

      // Add exam to room's scheduled list
      room.exams_scheduled.push(exam._id);
      await room.save();
    }

    if (studentIndex < totalStudents) {
      return res.status(400).json({
        message: "Not enough rooms to accommodate all students.",
        partial: true,
        allocated: studentIndex,
        total: totalStudents,
      });
    }

    return res.status(201).json({
      message: "Seating arrangement generated successfully.",
      seatings,
    });
  } catch (error) {
    console.error("Seating Generation Error:", error);
    res
      .status(500)
      .json({ message: "Server error during seating generation." });
  }
};

export const getStudentSeatingDetails = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const seatings = await Seating.find({
      "seat_allocations.student_id": studentId,
    })
      .populate({
        path: "exam_id",
        populate: { path: "subject_id", select: "subject_name subject_id" },
        select: "exam_date exam_type subject_id",
      })
      .populate("room_id", "room_no capacity")
      .lean(); // lean gives plain JS object

    const result = seatings.map((seating) => {
      const seatInfo = seating.seat_allocations.find(
        (s) => s.student_id.toString() === studentId
      );

      return {
        exam_date: seating.exam_id.exam_date,
        exam_type: seating.exam_id.exam_type,
        subject: seating.exam_id.subject_id.subject_name,
        subject_id: seating.exam_id.subject_id.subject_id,
        room: {
          room_no: seating.room_id.room_no,
          capacity: seating.room_id.capacity,
        },
        seat_no: seatInfo?.seat_no || "N/A",
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching seating details:", err);
    res.status(500).json({ error: "Server error" });
  }
};
