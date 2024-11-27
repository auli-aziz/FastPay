const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(morgan("combined"));

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your front-end origin
  methods: ['GET', 'POST'],       // Allow specific HTTP methods
  credentials: true               // Allow cookies and credentials
}));

// // Weak session storage
// let sessions = {};

// // Weak JWT secret
// const WEAK_SECRET = 'secret';

// // Login endpoint
// app.post('/login', (req, res) => {
//     const { username } = req.body;

//     // Weak session ID
//     const sessionId = username + '123';
//     sessions[sessionId] = { username };

//     // Weak JWT for user validation
//     const token = jwt.sign({ userId: username }, WEAK_SECRET, { algorithm: 'HS256' });

//     // Set session ID cookie
//     res.cookie('SESSION_ID', sessionId, { httpOnly: true });
//     res.send({ message: 'Logged in', token });
// });

// // Transaction endpoint
// app.post('/transfer', (req, res) => {
//     const sessionId = req.cookies.SESSION_ID;
//     const token = req.headers.authorization?.split(' ')[1];

//     // Check session ID validity
//     if (!sessions[sessionId]) {
//         return res.status(401).send({ error: 'Invalid session' });
//     }

//     try {
//         // Decode JWT (no proper validation of claims)
//         const decoded = jwt.verify(token, WEAK_SECRET);

//         const { userId } = decoded; // This can be tampered with
//         const { amount, toAccount } = req.body;

//         res.send({
//             message: `Transaction of $${amount} sent from ${userId} to ${toAccount}`,
//         });
//     } catch (err) {
//         res.status(401).send({ error: 'Invalid token' });
//     }
// });

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}...`));
