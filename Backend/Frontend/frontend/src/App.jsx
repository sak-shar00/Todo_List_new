import React, { useEffect } from 'react';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import About from './components/about/About';
import Todo from './components/todo/Todo';
import Signup from './components/signup/Signup';
import Signin from './components/signin/Signin';
import Footer from './components/footer/Footer';
import { useDispatch } from 'react-redux';
import { authActions } from './store';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const id = sessionStorage.getItem("id");
    if (id) {
      dispatch(authActions.login());  // ✅ FIX 1: add () to call the function
    }
  }, [dispatch]); // ✅ FIX 2: Add dispatch to dependency array for best practice

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/todo" element={<Todo />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/signin" element={<Signin />} />

          {/* ❌ FIX 3: Remove duplicate route or change its path */}
          {/* <Route exact path="/signin" element={<About />} /> */}
        </Routes>
      </Router>
      <Footer />
    </div>
  );
};

export default App;
