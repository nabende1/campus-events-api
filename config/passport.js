const GitHubStrategy = require('passport-github2').Strategy;

const initializePassport = (passport) => {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackURL =
    process.env.GITHUB_CALLBACK_URL ||
    (process.env.RENDER_EXTERNAL_URL
      ? `${process.env.RENDER_EXTERNAL_URL}/auth/github/callback`
      : 'http://localhost:3000/auth/github/callback');

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  if (!clientID || !clientSecret) {
    return;
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          provider: 'github'
        };
        return done(null, user);
      }
    )
  );
};

module.exports = initializePassport;