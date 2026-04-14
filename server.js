require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const mongodb = require('./data/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Campus Events API running on port ${port}`);
    console.log(`Swagger docs: http://localhost:${port}/api-docs`);
  });
});
