import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { admin_id, first_name, last_name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({
      admin_id,
      first_name,
      last_name,
      email,
      password,
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering admin", error: error.message });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, admin });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get Admin by ID
export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin details", error: error.message });
  }
};

// Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { first_name, last_name, email },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Admin updated successfully", updatedAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating admin", error: error.message });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found!" });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
