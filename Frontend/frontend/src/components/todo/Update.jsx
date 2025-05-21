import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Update = ({ display, update, onUpdate }) => {
  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    if (update) {
      setInputs({
        title: update.title || "",
        body: update.body || "",
      });
    } else {
      setInputs({ title: "", body: "" });
    }
  }, [update]);

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleSubmit = async () => {
    if (!Inputs.title.trim() || !Inputs.body.trim()) {
      toast.error("Title and Body cannot be empty");
      return;
    }

    try {
      const email = localStorage.getItem("userEmail");
      const response = await axios.put(
        `http://localhost:5000/api/updatetask/${update._id}`,
        {
          ...Inputs,
          email: email,
        }
      );

      if (response.status === 200) {
        toast.success("Task updated successfully");
        onUpdate(response.data.task);  // Pass updated task back to parent
        display("none");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-5 d-flex justify-content-center align-items-start flex-column update">
      <h3><b>Update Your Task</b></h3>
      <input
        type="text"
        className="todo-inputs my-4 w-100 p-3"
        value={Inputs.title}
        name="title"
        onChange={change}
      />
      <textarea
        className="todo-inputs w-100 p-3"
        value={Inputs.body}
        name="body"
        onChange={change}
      />
      <div>
        <button className="btn btn-dark my-4" onClick={handleSubmit}>UPDATE</button>
        <button className="btn btn-danger my-4 mx-3" onClick={() => display("none")}>Close</button>
      </div>
    </div>
  );
};

export default Update;
