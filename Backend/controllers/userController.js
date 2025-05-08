const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const User = require("../models/user");

// ==================
// @desc    Register User
// @route   POST /api/register
// @access  Public
// ==================
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already taken");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);

  // Create user
  const createdUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (createdUser) {
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
      },
    });
  } else {
    res.status(400);
    throw new Error("User registration failed");
  }
});

// ==================
// @desc    Login User
// @route   POST /api/login
// @access  Public
// ==================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email });

  // Compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    // Simply respond with user data (no JWT required)
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});


module.exports = { registerUser, loginUser };
