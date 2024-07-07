import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for password length
    if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setMessage(''); // Clear any previous success message
        return; // Stop the function here
    }

    try {
        const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
        console.log(res.data);
        setMessage('Signup successful');
        setError(''); 
         setTimeout(() => {
            navigate('/login'); 
        }, 3000); 
    } catch (error) {
        console.error(error);
        let errorMessage = 'Signup failed due to an unexpected error'; 
        if (error.response) {
            switch (error.response.status) {
                case 409: // HTTP status code for conflict, e.g., user already exists
                    errorMessage = 'User already exists';
                    break;
                case 400: // HTTP status code for bad request, e.g., validation failed
                    errorMessage = error.response.data.message || 'Signup failed due to invalid data';
                    break;
                default:
                    errorMessage = 'Signup failed or the user already exists';
            }
        }
        setError(errorMessage); 
        setMessage(''); 
    }
};

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='email'
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button type="submit">Signup</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
             <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;
