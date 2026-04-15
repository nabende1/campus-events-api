const swaggerAutogen = require('swagger-autogen')();

const renderUrl = process.env.RENDER_EXTERNAL_URL;
const derivedHost = renderUrl ? renderUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
const defaultSchemes = renderUrl ? ['https'] : ['http'];

const doc = {
  info: {
    title: 'Campus Events API',
    description: 'API for managing events, organizers, venues, and registrations',
    version: '1.0.0'
  },
  host: process.env.SWAGGER_HOST || derivedHost || 'localhost:8081',
  schemes: process.env.SWAGGER_SCHEMES
    ? process.env.SWAGGER_SCHEMES.split(',').map((scheme) => scheme.trim())
    : defaultSchemes,
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Events', description: 'Event CRUD operations' },
    { name: 'Organizers', description: 'Organizer CRUD operations' },
    { name: 'Venues', description: 'Venue CRUD operations' },
    { name: 'Registrations', description: 'Registration CRUD operations' }
  ],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      flow: 'authorizationCode',
      authorizationUrl: `${renderUrl ? renderUrl.replace(/\/$/, '') : 'http://localhost:3000'}/auth/github`,
      tokenUrl: `${renderUrl ? renderUrl.replace(/\/$/, '') : 'http://localhost:3000'}/auth/github/callback`,
      scopes: { 'user:email': 'Access user email' }
    }
  },
  definitions: {
    Event: {
      title: 'Hackathon 2026',
      date: '2026-05-10',
      location: 'Engineering Building',
      organizerId: '6801234567890abcde123456',
      venueId: '6801234567890abcde123466',
      category: 'hackathon',
      startTime: '17:30',
      endTime: '20:30',
      isVirtual: false,
      description: 'Hands-on coding challenge with mentor support and prizes.'
    },
    Organizer: {
      name: 'Tech Club',
      email: 'techclub@university.edu',
      phone: '555-123-4567'
    },
    Venue: {
      name: 'Innovation Hall',
      building: 'Science Complex',
      capacity: 180
    },
    Registration: {
      eventId: '6801234567890abcde123456',
      attendeeName: 'Jane Doe',
      attendeeEmail: 'jane.doe@school.edu',
      status: 'registered'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './server.js',
  './routes/auth.js',
  './routes/index.js',
  './routes/events.js',
  './routes/organizers.js',
  './routes/venues.js',
  './routes/registrations.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
