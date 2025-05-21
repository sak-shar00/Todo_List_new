import React, { useState } from 'react';
import './signup.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const SignUp = () => {
  const history=useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${window.location.origin}/api/register`, formData);

      alert('User registered successfully!');
      setFormData({ username: '', email: '', password: '' });
      history('/signin')//navigate to signin
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data?.message) {
        alert(error.response.data.message);
      } else {
       toast.error("Email already taken");
      }
    }
  };

  return (
    <div className='signup'>
      <ToastContainer/>
      <div className="signup-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
