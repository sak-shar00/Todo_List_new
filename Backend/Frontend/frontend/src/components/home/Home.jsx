import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="container text-center">
        <h1>
          Organize your <br /> work and life, finally
        </h1>
        <p>
          Become focused, organized, and calm with <br />
          todo app. The world's #1 task manager app.
        </p>
        <button className="home-btn p-2">Make Todo List</button>
      </div>
    </div>
  );
};

export default Home;
