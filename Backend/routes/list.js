const express = require('express');
const router = express.Router();

const {
  addTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
} = require("../controllers/listController");

router.post("/addtask", addTask);
router.get("/getalltask", getAllTasks);
router.get("/gettask/:id", getTask);
router.put("/updatetask/:id", updateTask);
router.delete("/deletetask/:id", deleteTask);

module.exports = router;
