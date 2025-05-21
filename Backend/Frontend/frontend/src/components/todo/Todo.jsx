import React, { useState, useEffect } from 'react'; 
import './todo.css';
import TodoCards from './TodoCards';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update from './Update';
import axios from "axios";

const Todo = () => {
  const [Inputs, setInputs] = useState({ title: "", body: "" });
  const [Array, setArray] = useState([]);
  const [toUpdateArray, setToUpdateArray] = useState(null);

  const id = sessionStorage.getItem("id"); 
  const email = localStorage.getItem("userEmail"); 

  // Fetch tasks on mount or when id changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/api/gettask/${id}`);
        setArray(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load your tasks");
      }
    };
    fetchTasks();
  }, [id]);

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
      return;
    }
    try {
      const response = await axios.post(`${window.location.origin}/api/addtask`, {
        title: Inputs.title,
        body: Inputs.body,
        email: email
      });
      // Add new task from response if available
      setArray([...Array, response.data.task || Inputs]);
      setInputs({ title: "", body: "" });
      toast.success("Your Task is Added");
    } catch (error) {
      console.error(error);
      toast.error("Your Task is not Saved! Please Sign Up");
    }
  };

  const del = async (taskId) => {
    try {
      const response = await axios.delete(`${window.location.origin}/api/deletetask/${taskId}`, {
        data: { email: email }
      });

      if (response.status === 200) {
        setArray(Array.filter((task) => task._id !== taskId));
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

  const update = (index) => {
    setToUpdateArray(Array[index]);
    dis("block");
  };

  // This is the new function to update the task in the list after edit
  const handleUpdatedTask = (updatedTask) => {
    setArray(prevArray => prevArray.map(task => task._id === updatedTask._id ? updatedTask : task));
    dis("none"); // hide update form
    toast.success("Task updated successfully");
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
          <div className="todo-body">
            {Array && Array.map((item, index) => (
              <div key={item._id} className="todo-card">
                <TodoCards 
                  title={item.title} 
                  body={item.body} 
                  id={item._id} 
                  del={del} 
                  display={dis}  
                  updateId={index}  
                  toBeUpdate={update}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="todo-update" id="todo-update" style={{ display: 'none' }}>
        <div className='container update'>
          <Update display={dis} update={toUpdateArray} onUpdate={handleUpdatedTask} />
        </div>
      </div>
    </div>
  );
};

export default Todo;
