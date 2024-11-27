const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validateSession = async (req, res, next) => {
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

    // Attach user to request object
    req.userDetails = session.user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error validating session:", error);
    res.status(500).json({ error: "Failed to validate session." });
  }
};

module.exports = { validateSession };
