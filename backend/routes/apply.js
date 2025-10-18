const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Application Schema
const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    roleType: { type: String, enum: ["Job", "Internship"], required: true },
    position: { type: String, required: true },
    resumeUrl: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

// ✅ Submit Application
router.post("/", async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error("❌ Error saving application:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// ✅ Admin - View all applications
router.get("/admin", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

module.exports = router;
