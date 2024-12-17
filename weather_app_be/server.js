const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "https://matejsoffr.net"], // FE lokální i produkční URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB Atlas"));
db.on("error", (error) => console.error("MongoDB connection error:", error));

// Schema & Model
const weatherSchema = new mongoose.Schema({
  data: String,
  temperature: String,
  timestamp: String,
});
const Weather = mongoose.model("Weather", weatherSchema);

// Login credentials
const USERNAME = "dedapocasi";
const PASSWORD = "MameRadiPocasi";

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  const { username, password } = req.headers;
  if (username === USERNAME && password === PASSWORD) {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized access" });
  }
};

// Weather endpoints with authentication
app.get("/api/weather", authMiddleware, async (req, res) => {
  const entries = await Weather.find();
  res.json(entries);
});

app.post("/api/weather", authMiddleware, async (req, res) => {
  const { data, temperature, timestamp } = req.body;
  const newEntry = new Weather({ data, temperature, timestamp });
  await newEntry.save();
  res.status(201).json(newEntry);
});

app.delete("/api/weather/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Weather.findByIdAndDelete(id);
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting entry", error });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
