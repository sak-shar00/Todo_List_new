const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const List = require("../models/list");

// CREATE
const addTask = asyncHandler(async (req, res) => {
  const { title, body, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const list = new List({
      title,
      body,
      user: existingUser._id,
    });

    await list.save();

    // Add task to user's list array and save user
    existingUser.list.push(list._id);
    await existingUser.save();

    res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// READ all tasks
const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await List.find().sort({ createdAt: -1 });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// READ tasks by user id
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

// UPDATE task
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

// DELETE task
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

    // Remove task id from user's list array
    existingUser.list = existingUser.list.filter(
      (taskId) => taskId.toString() !== req.params.id
    );
    await existingUser.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = { addTask, updateTask, deleteTask, getAllTasks, getTask };
