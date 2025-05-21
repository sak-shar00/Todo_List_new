const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const path = require("path");

const app = express();

const auth = require("./routes/auth.js");
const list = require("./routes/list.js");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// API routes
app.use("/api", auth);
app.use("/api", list);

// Serve React build static files
app.use(express.static(path.resolve(__dirname, "../Frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/build", "index.html"));
});

connectDB();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
