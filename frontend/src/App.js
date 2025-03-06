import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';

function Home() {
  return (
    <div>
      <h2>Welcome! Please choose to sign up or log in.</h2>
      <Link to="/signup"><button>Sign Up</button></Link>
      <Link to="/login"><button>Log In</button></Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
