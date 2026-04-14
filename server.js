const dotenv = require('dotenv');
const mongodb = require('./data/database');
const app = require('./app');

dotenv.config();

const port = process.env.PORT || 3000;

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
