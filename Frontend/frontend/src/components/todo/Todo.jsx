import React, { useState, useEffect } from 'react'; 
import './todo.css';
import TodoCards from './TodoCards';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update from './Update';
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import axios from "axios";

const Todo = () => {
  const [Inputs, setInputs] = useState({ title: "", body: "" });
  const [Array, setArray] = useState([]);
  const id = sessionStorage.getItem("id"); // ✅ Fetch id here
  const email = localStorage.getItem("userEmail"); // ✅ Get email here

  // Fetch tasks when the component mounts or id changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gettask/${id}`);
        setArray(response.data.tasks); // ✅ Set tasks to array
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load your tasks");
      }
    };
    fetchTasks();
  }, [id]); // ✅ id in dependency array

  const show = () => {
    const textarea = document.getElementById("textarea");
    if (textarea) {
      textarea.classList.add("show");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleSubmit = async () => {
    if (Inputs.title === "" || Inputs.body === "") {
      toast.error("Title or Body should not be empty");
    } else {
      try {
        // Post new task
        await axios.post("http://localhost:5000/api/addtask", {
          title: Inputs.title,
          body: Inputs.body,
          email: email
        });
        setArray([...Array, Inputs]); // ✅ Append new task
        setInputs({ title: "", body: "" });
        toast.success("Your Task is Added");
      } catch (error) {
        console.error(error);
        toast.error("Your Task is not Saved! Please Sign Up");
      }
    }
  };

  // Handle task deletion
  const del = async (taskId) => {
    try {
      // Send DELETE request to delete the task
      const response = await axios.delete(`http://localhost:5000/api/deletetask/${taskId}`, {
        data: { email: email } // Send email to verify user
      });

      if (response.status === 200) {
        // Update task list by removing the deleted task
        setArray(Array.filter((task) => task._id !== taskId)); // Remove task from array
        toast.success("Task Successfully Deleted");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const dis = (value) => {
    document.getElementById("todo-update").style.display = value;
  };

  return (
    <div className='todo'>
      <ToastContainer />
      <div className='todo-main container d-flex justify-content-center align-items-center flex-column mt-5'>
        <div className='d-flex flex-column todo-inputs-div p-3'>
          <input
            type='text'
            placeholder='Title'
            className='my-2 p-2 todo-inputs'
            onClick={show}
            name="title"
            value={Inputs.title}
            onChange={handleChange}
          />
          <textarea
            id="textarea"
            placeholder='Body'
            name="body"
            value={Inputs.body}
            className='p-2 todo-inputs'
            onChange={handleChange}
          />
          <button className='home-btn mt-3 align-self-end' onClick={() => { show(); handleSubmit(); }}>Add Task</button>
        </div>
      </div>
      <div className="todo-body">
  <div className="container-fluid">
    {/* Updated layout for horizontal display */}
    <div className="todo-body">
      {Array && Array.map((item, index) => (
        <div key={index} className="todo-card">
          <TodoCards title={item.title} body={item.body} id={item._id} del={del} display={dis} />
        </div>
      ))}
    </div>
  </div>
</div>

      <div className="todo-update" id="todo-update">
        <div className='container update'> <Update display={dis} /></div>
      </div>
    </div>
  );
};

export default Todo;
