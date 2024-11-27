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
    const { name, email, phone, role } = session.user;
    res.status(200).json({ name, email, phone, role });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ error: "Failed to retrieve user information." });
  }
};

exports.getAdminDashboard = async (req, res) => {
  const sessionId = req.cookies.SESSION_ID;

  console.log("Hit");
  
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized. Session ID not provided." });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { sessionId },
      include: {
        user: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired or invalid." });
    }

    const { role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden. User is not an admin." });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({ message: "Admin Dashboard Data", data: { users } });
  } catch (error) {
    console.error("Error retrieving admin dashboard data:", error);
    res.status(500).json({ error: "Failed to retrieve admin dashboard data." });
  }
};
