require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport');

const initializePassport = require('./config/passport');

const app = express();
const swaggerDocument = require('./swagger-output.json');
const renderUrl = process.env.RENDER_EXTERNAL_URL;

const configuredSwaggerHost = process.env.SWAGGER_HOST;
const derivedHost = renderUrl ? renderUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
swaggerDocument.host = configuredSwaggerHost || derivedHost || swaggerDocument.host;

if (process.env.SWAGGER_SCHEMES) {
  swaggerDocument.schemes = process.env.SWAGGER_SCHEMES.split(',').map((scheme) => scheme.trim());
} else if (renderUrl) {
  swaggerDocument.schemes = ['https'];
}

app.use(cors());
app.use(express.json());
const isProduction = process.env.NODE_ENV === 'production' || !!renderUrl;

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'campus-events-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax'
    }
  })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes'));

module.exports = app;