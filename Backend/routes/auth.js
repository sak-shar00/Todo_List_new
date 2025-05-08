const express = require('express');
const router = express.Router();

// Import the registerUser and loginUser functions
const { registerUser, loginUser } = require("../controllers/userController");

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
