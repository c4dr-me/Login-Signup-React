// Example configuration in server.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const allowedOrigins = [
  'https://localhost:5173',
  'http://localhost:5000',
  'https://login-signup-react-t8ka.onrender.com',
  'https://login-signup-react-1.onrender.com',
];

const corsOptions = {
  origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
};

app.use(cors(corsOptions));

const helmet = require('helmet');
app.use(helmet());

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback' 
},
(profile, done) => {
  return done(null, profile);
}
));

// Auth routes
app.use('/api/auth', authRoutes);

// Google OAuth routes3x
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/home'); 
  });

  app.post('/api/auth/google-login', async (req, res) => {
    const { token }  = req.body;
    async function verify() {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,  
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      
      let user = await User.findOne({ googleId: userid });
      if (!user) {
       
        user = await User.create({
          email: payload['email'],
          name: payload['name'],
          googleId: userid,
          picture: payload['picture'],
        });
      }
      // Generate a token (or use session)
      const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', userToken, { httpOnly: true, secure: true, sameSite: 'None', });
    res.status(200).json({ message: "Google login successful" });
    }
   verify().catch(error => {
  console.error(error);
  res.status(500).json({ message: "An error occurred during Google login" });
});
  });

// Serve static files (example with React frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
