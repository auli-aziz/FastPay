const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUserInfo = async (req, res) => {
  try {
    const { name, email, phone, role } = req.userDetails;
    res.status(200).json({ name, email, phone, role });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user information." });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. User is not an admin." });
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(200).json({ message: "Admin Dashboard Data", data: { users } });
  } catch (error) {
    console.error("Error retrieving admin dashboard data:", error);
    res.status(500).json({ error: "Failed to retrieve admin dashboard data." });
  }
};
