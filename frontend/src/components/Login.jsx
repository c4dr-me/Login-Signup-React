import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically load the Google Identity Services library
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLoginSuccess,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
         { theme: "filled_blue", size: "large", shape: "pill", type: "standard", width: "300px", height: "50px"}
      );
      
    };
    script.onerror = () => {
      console.error("Failed to load the Google Identity Services script");
    };
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginFailed(false);
    try {
      const response = await axios.post(
        "https://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        setMessage("Login successful");
        navigate("/home");
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

  const handleGoogleLoginSuccess = async (response) => {
    // console.log("Google login success callback called", response);
    try {
      const { credential } = response;
     // console.log("Credential received from Google:", credential);
      const googleResponse = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        {
          token: credential,
        }
      );
      console.log("Response from server:", googleResponse);
      if (googleResponse.status === 200) {
        setMessage("Google login successful");
        // console.log("Login successful");
        // console.log(googleResponse.data);
        navigate("/home");
      } else {
        setLoginFailed(true);
        setMessage("Google login failed. Please try again.");
      }
    } catch (error) {
      setLoginFailed(true);
      setMessage("Google login failed. Please try again.");
      console.error("Error during Google login:", error);
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
            autoComplete="current-password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        {message && (
          <p className={loginFailed ? "message-error" : ""}>{message}</p>
        )}
        <div id="google-login-button"></div>
      </div>
    </div>
  );
};

export default Login;