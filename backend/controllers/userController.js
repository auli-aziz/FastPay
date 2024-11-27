const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
