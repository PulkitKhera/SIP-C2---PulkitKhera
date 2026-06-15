const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDB = require("./config/db");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const agentRoutes = require("./routes/agentRoutes"); // NEW
const chatRoutes = require("./routes/chatRoutes");   // NEW

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectToDB();

// Register all endpoints
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes); // NEW
app.use("/api/chat", chatRoutes);   // NEW

app.get("/", (req, res) => {
  res.send("Online Complaint Registration API is fully operational.");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});