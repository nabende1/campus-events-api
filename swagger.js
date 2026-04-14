const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Campus Events API',
    description: 'API for managing events and organizers',
    version: '1.0.0'
  },
  host: process.env.SWAGGER_HOST || 'localhost:8081',
  schemes: process.env.SWAGGER_SCHEMES
    ? process.env.SWAGGER_SCHEMES.split(',').map((scheme) => scheme.trim())
    : ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Events', description: 'Event CRUD operations' },
    { name: 'Organizers', description: 'Organizer CRUD operations' }
  ],
  definitions: {
    Event: {
      title: 'Hackathon 2026',
      date: '2026-05-10',
      location: 'Engineering Building',
      organizerId: '6801234567890abcde123456'
    },
    Organizer: {
      name: 'Tech Club',
      email: 'techclub@university.edu',
      phone: '555-123-4567'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js', './routes/index.js', './routes/events.js', './routes/organizers.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
