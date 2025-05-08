const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const List = require("../models/list");

// CREATE
const addTask = asyncHandler(async (req, res) => {
  const { title, body, email } = req.body;

  try {
    // Find user by email
    const existingUser = await User.findOne({ email });

    // If user exists, create and save a new task
    if (existingUser) {
      const list = new List({
        title,
        body,
        user: existingUser._id, // Store the user's ObjectId in the list
      });

      // Save the list item
      await list.save();

      // Add the list item to the user's list
      existingUser.list.push(list);
      await existingUser.save();

      // Respond with the created list
      res.status(200).json({ list });
    } else {
      // If user doesn't exist
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// READ: Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await List.find().sort({ createdAt: -1 }); // Newest first

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    // Send tasks directly as an array
    res.status(200).json(tasks); // ✅ Directly sending tasks array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// READ: Get task by user ID
const getTask = asyncHandler(async (req, res) => {
  try {
    const tasks = await List.find({ user: req.params.id }).sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE
const updateTask = asyncHandler(async (req, res) => {
  const { title, body, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const updatedTask = await List.findOneAndUpdate(
      { _id: req.params.id, user: existingUser._id },
      { title, body },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or doesn't belong to user" });
    }

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE
const deleteTask = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const deletedTask = await List.findOneAndDelete({
      _id: req.params.id,
      user: existingUser._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or doesn't belong to user" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = { addTask, updateTask, deleteTask, getAllTasks, getTask };
