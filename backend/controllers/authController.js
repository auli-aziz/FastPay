const { PrismaClient } = require('@prisma/client');
const { cleanUpExpiredSessions } = require('../services/sessionService');

const prisma = new PrismaClient();

// Weak session ID generator
const generateWeakSessionId = (name) => name.replace(/\s+/g, '') + "123";

// Signup controller
exports.signup = async (req, res) => {
  const { email, phone, name, password } = req.body;
  
  if (!email || !phone || !name || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Create the user
    const user = await prisma.user.create({
      data: { email, phone, name, password },
    });

    res.status(201).json({ message: 'User registered successfully.', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user.' });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    await cleanUpExpiredSessions();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const sessionId = generateWeakSessionId(user.name);
    
    // Set session expiration time
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);  // Set expiry to 1 hour from now

    // Create the session in the database
    await prisma.session.create({
      data: {
        sessionId,
        userId: user.id,
        expiresAt,
      },
    });

    // Set the cookie with the expiration
    res.cookie('SESSION_ID', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // Expires in 1 hour
    });

    res.status(200).json({ message: 'Login successful.', sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in.' });
  }
};

exports.logout = async (req, res) => {
  const sessionId = req.cookies.SESSION_ID;
  
  try {
    // Delete the session from the database
    await prisma.session.delete({
      where: { sessionId },
    });

    // Clear the cookie on the client side
    res.clearCookie('SESSION_ID');

    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(404).json({ error: 'Session not found or already expired.' });
  }
};
