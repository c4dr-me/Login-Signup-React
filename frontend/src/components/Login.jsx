import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState(false); 
  const navigate = useNavigate(); 

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginFailed(false); 
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );
    if (response.status === 200) {
      setMessage("Login successful");
      navigate('/Home'); 
    } else {
      setLoginFailed(true);
      setMessage("Login failed. Please check your credentials.");
    }
  } catch (error) {
    setLoginFailed(true); 
    if (error.response && error.response.status === 404) {
      setMessage("User does not exist. Please sign up first.");
    } else {
      setMessage("Login failed. Please check your credentials.");
    }
    console.error("Error during login:", error);
  }
};

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        {message && <p className={loginFailed ? "message-error" : ""}>{message}</p>} 
      </div>
    </div>
  );
};

export default Login;