const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { cleanUpExpiredSessions } = require("../services/sessionService");

// Weak session ID generator
const generateSessionId = (name) => name.replace(/\s+/g, "") + "123";

// Signup controller
exports.signup = async (req, res) => {
  const { email, phone, name, password } = req.body;

  if (!email || !phone || !name || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log(existingUser);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email." });
    }

    // Create the user
    const user = await prisma.user.create({
      data: { email, phone, name, password },
    });

    res
      .status(201)
      .json({ message: "User registered successfully.", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user." });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    await cleanUpExpiredSessions();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const sessionId = generateSessionId(user.name);

    // Set session expiration time
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Set expiry to 1 hour from now

    // Create the session in the database
    await prisma.session.create({
      data: {
        sessionId,
        userId: user.id,
        expiresAt,
      },
    });

    // Set the cookie with the expiration
    res.cookie("SESSION_ID", sessionId, {
      httpOnly: true,
      httpOnly: false, 
      secure: false, 
      maxAge: 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful.", sessionId });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in." });
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
    res.clearCookie("SESSION_ID");

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(404).json({ error: "Session not found or already expired." });
  }
};

exports.getUserInfo = async (req, res) => {
  const sessionId = req.cookies.SESSION_ID;

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized. Session ID not provided." });
  }

  try {
    // Find the session in the database
    const session = await prisma.session.findUnique({
      where: { sessionId },
      include: {
        user: true, // Include user details
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired or invalid." });
    }

    // Return the user's information
    const { name, email, phone } = session.user;
    res.status(200).json({ name, email, phone });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ error: "Failed to retrieve user information." });
  }
};
