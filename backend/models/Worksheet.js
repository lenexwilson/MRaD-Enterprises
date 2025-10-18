const mongoose = require("mongoose");

const worksheetSchema = new mongoose.Schema({
  userId: { type: String, required: true },      // employee ID
  userName: { type: String, required: true },    // employee name
  hoursWorked: { type: Number, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Worksheet", worksheetSchema);
