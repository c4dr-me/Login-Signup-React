const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const router = express.Router();


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many login attempts from this IP, please try again later'
});

router.post('/signup', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ message: 'Signup failed or user already exists', errors: errorMessages });
    }

    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // set to true in production
            sameSite: 'strict', // adjust according to your requirements
            maxAge: 3600000 // cookie expiry set to match token expiry
        }).status(201).send('Signup successful');
    } catch (error) {
        console.error('Error in signup:', error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', loginLimiter, [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').exists().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

       
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // set to true in production
            sameSite: 'strict', // adjust according to your requirements
            maxAge: 3600000 // cookie expiry set to match token expiry
        }).send('Login successful');
    } catch (error) {
        console.error('Error in login:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;