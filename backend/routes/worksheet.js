const express = require("express");
const Worksheet = require("../models/Worksheet");
const router = express.Router();

// Create new worksheet (Employee)
router.post("/", async (req, res) => {
  try {
    const { userId, userName, hoursWorked, summary } = req.body;

    if (!userId || !userName || !hoursWorked || !summary) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const worksheet = new Worksheet({ userId, userName, hoursWorked, summary });
    await worksheet.save();

    res.status(201).json({ message: "Worksheet saved successfully", worksheet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving worksheet" });
  }
});

// Get all worksheets (Admin)
router.get("/", async (req, res) => {
  try {
    const worksheets = await Worksheet.find();
    res.json(worksheets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch worksheets" });
  }
});

// Get worksheets by user (Employee)
router.get("/user/:userId", async (req, res) => {
  try {
    const worksheets = await Worksheet.find({ userId: req.params.userId });
    res.json(worksheets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user worksheets" });
  }
});

// Update worksheet (Admin)
router.put("/:id", async (req, res) => {
  try {
    const { hoursWorked, summary } = req.body;
    if (!hoursWorked || !summary) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const worksheet = await Worksheet.findByIdAndUpdate(
      req.params.id,
      { hoursWorked, summary },
      { new: true }
    );

    if (!worksheet) return res.status(404).json({ error: "Worksheet not found" });

    res.json(worksheet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating worksheet" });
  }
});

module.exports = router;
