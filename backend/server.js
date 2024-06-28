const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const authRoutes = require('./routes/auth');

const cookieParser = require('cookie-parser');
const app = express();



// Middleware
app.use(express.json());
app.use(cors()); 
app.use(cookieParser());

connectDB();

// Routes
app.use('/api/auth', authRoutes); 



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
