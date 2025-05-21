const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const path = require("path");

const auth = require("./routes/auth.js");
const list = require("./routes/list.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// API routes
app.use("/api", auth);
app.use("/api", list);

// Serve frontend built by Vite (dist folder)
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});

// Connect DB and start server
connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
