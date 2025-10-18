const express = require("express");
const multer = require("multer");
const Application = require("../models/Application");
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /api/applications
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const resume = req.file.path;

    const application = new Application({ name, email, phone, role, resume });
    await application.save();

    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit application." });
  }
});

// GET /api/applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications." });
  }
});

module.exports = router;
