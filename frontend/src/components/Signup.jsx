import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
            console.log(res.data);
            setMessage('Signup successful');
            setError(''); // Clear any previous error message
        } catch (error) {
            console.error(error);
            setError('Signup failed or the user already exists'); // Set error message on failure
            setMessage(''); // Clear success message if any
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
