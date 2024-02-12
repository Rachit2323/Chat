import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin.js";
import Dash from "./Components/Dash/Dash.js";

const App = () => {
  const Auth = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        {Auth ? (
          <Route path="/dash" element={<Dash />} />
        ) : (
          <Route path="/signin" element={<Signin />} />
        )}
        {!Auth && <Route path="/dash" element={<Signin />} />}
        {Auth && <Route path="/" element={<Dash />} />}
      </Routes>
    </Router>
  );
};

export default App;
