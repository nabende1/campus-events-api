const ensureAuthenticated = (req, res, next) => {
  if (process.env.AUTH_DISABLED === 'true') {
    return next();
  }

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: 'Authentication required. Login at /auth/github before using this endpoint.'
  });
};

module.exports = { ensureAuthenticated };