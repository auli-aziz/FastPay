const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cleanup expired sessions
const cleanUpExpiredSessions = async () => {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lte: new Date() }, // Delete sessions that have expired
      },
    });
    console.log(`Deleted ${result.count} expired sessions.`);
  } catch (error) {
    console.error('Failed to clean up expired sessions:', error);
  }
};

// Export the cleanup function so it can be used elsewhere
module.exports = { cleanUpExpiredSessions };
