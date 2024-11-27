const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword, verifyPassword, generateToken } = require("../utils/authUtils");
const { setCookie, clearCookie } = require("../utils/cookieUtils");

// Signup controller
exports.signup = async (req, res) => {
  const { email, phone, name, password } = req.body;

  if (!email || !phone || !name || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: { email, phone, name, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully.", userId: user.id });
  } catch (error) {
    console.error("Signup error:", error);
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
    const user = await prisma.user.findUnique({ where: { email } });

    // Validate user and password
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate a unique session ID (optional enhancement)
    const sessionId = crypto.randomUUID();

    // Create session expiration time
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store session in the database
    await prisma.session.create({
      data: {
        sessionId,
        userId: user.id,
        expiresAt,
      },
    });

    // Create JWT token
    const token = generateToken({ userId: user.id, role: user.role });

    // Set secure cookie with session ID
    setCookie(res, "SESSION_ID", sessionId, { maxAge: 60 * 60 * 1000 });

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in." });
  }
};

// Logout controller
exports.logout = async (req, res) => {
  const sessionId = req.cookies?.SESSION_ID; 

  try {
    // Remove the session from the database
    await prisma.session.delete({
      where: { sessionId },
    });

    // Clear the session cookie
    clearCookie(res, "SESSION_ID");

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);

    // Handle case where session ID does not exist in the database
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Session not found." });
    }

    res.status(500).json({ error: "Failed to log out." });
  }
};
