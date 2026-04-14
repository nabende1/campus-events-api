const router = require('express').Router();
const passport = require('passport');

const oauthConfigured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

router.get('/', (req, res) => {
  res.status(200).json({
    oauthConfigured,
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    user: req.user || null,
    loginPath: '/auth/github',
    logoutPath: '/auth/logout'
  });
});

router.get('/github', (req, res, next) => {
  if (!oauthConfigured) {
    return res.status(503).json({ error: 'OAuth is not configured on this server' });
  }

  return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get(
  '/github/callback',
  (req, res, next) => {
    if (!oauthConfigured) {
      return res.status(503).json({ error: 'OAuth is not configured on this server' });
    }

    return passport.authenticate('github', { failureRedirect: '/auth/failure' })(req, res, next);
  },
  (req, res) => {
    res.redirect('/auth/success');
  }
);

router.get('/success', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.status(200).json({ message: 'OAuth login successful', user: req.user });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'OAuth login failed' });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.status(200).json({ message: 'Logged out' });
    });
  });
});

module.exports = router;