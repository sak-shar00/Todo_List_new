import React, { useState } from 'react';
import './signin.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store';

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      if (response.data?.user) {
        alert('Login successful!');
        sessionStorage.setItem("id", response.data.user.id);
        localStorage.setItem("userEmail", response.data.user.email); // ✅ Store email
        dispatch(authActions.login());
        navigate('/todo');
      } else {
        alert('Invalid response from server');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="signin">
      <div className="sign-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="sign-form">
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={password} 
            onChange={handleChange} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
