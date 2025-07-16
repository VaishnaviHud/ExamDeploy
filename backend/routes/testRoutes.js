import express from "express";
import Grading from "../models/Grading.js";

const router = express.Router();

router.get("/test-populate", async (req, res) => {
  try {
    const result = await Grading.findOne().populate("subject_id", "subject_name");
    console.log("🎯 Test Populate Result:", result);
    res.json(result);
  } catch (err) {
    console.error("❌ Test Populate Error:", err);
    res.status(500).json({ message: "Populate test failed", error: err.message });
  }
});

export default router;
