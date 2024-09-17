import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home/Home';
import Login from './screens/Login/Login';
import CreateProfile from './screens/CreateProfile/CreateProfile';
import Signup from './screens/Signup/Signup';
import Tournament from './screens/Tournament/Tournament';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create_profile" element={<CreateProfile />} />
        <Route path="/tournament" element={<Tournament />} />
      </Routes>
    </Router>
  );
}

export default App;