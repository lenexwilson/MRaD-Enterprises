require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const worksheetRoutes = require("./routes/worksheet");
const messageRoutes = require("./routes/messages");
const applicationRoutes = require("./routes/application");

const app = express();

// ✅ CORS setup for production and local
const allowedOrigins = [
  "http://localhost:3000", // for local React
  "https://mrad-enterprises.vercel.app", // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/worksheets", worksheetRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/applications", applicationRoutes);

// ✅ Default route for testing
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully on Render!");
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Render requires this (listen on dynamic port)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
