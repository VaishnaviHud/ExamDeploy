import express from "express";
import { generateSeatingArrangement , getAllSeatingArrangements, getStudentSeatingDetails } from "../controllers/seating.controller.js";

const router = express.Router();
router.post("/generate-seating", generateSeatingArrangement);

router.get("/all", getAllSeatingArrangements);

router.get("/student/:studentId", getStudentSeatingDetails);

export default router;
