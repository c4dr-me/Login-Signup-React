import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
            console.log(res.data);
            if (response.status === 200) {
                setMessage("Signup successful");
              }
        } catch (error) {
            console.error(error);
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
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Signup</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
</div>
    );
};

export default Signup;
