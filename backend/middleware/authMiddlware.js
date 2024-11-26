exports.authMiddleware = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Session ID is required in cookies.' });
  }

  try {
    const session = await prisma.session.findUnique({ where: { sessionId } });

    if (!session) {
      return res.status(401).json({ error: 'Invalid session ID.' });
    }

    // Attach user ID to the request object
    req.userId = session.userId;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate session.' });
  }
};
