require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(morgan("combined"));

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your front-end origin
  methods: ['GET', 'POST'],       // Allow specific HTTP methods
  credentials: true               // Allow cookies and credentials
}));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}...`));
