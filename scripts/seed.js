const dns = require('dns');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

const encodeMongoURI = (uri) => {
  if (!uri) return uri;

  try {
    const uriPattern = /^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/;
    const match = uri.match(uriPattern);

    if (!match) return uri;

    const [, protocol, username, password, rest] = match;
    return `${protocol}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${rest}`;
  } catch {
    return uri;
  }
};

const sampleOrganizers = [
  {
    name: 'Campus Tech Society',
    email: 'techsociety@campus.edu',
    phone: '555-010-1001'
  },
  {
    name: 'Innovation Club',
    email: 'innovation@campus.edu',
    phone: '555-010-1002'
  },
  {
    name: 'Student Success Office',
    email: 'success.office@campus.edu',
    phone: '555-010-1003'
  }
];

const buildSampleEvents = (organizerIds) => [
  {
    title: 'Hack Night Kickoff',
    date: '2026-05-03',
    location: 'Engineering Lab A',
    organizerId: organizerIds[0]
  },
  {
    title: 'AI Career Panel',
    date: '2026-05-10',
    location: 'Main Auditorium',
    organizerId: organizerIds[1]
  },
  {
    title: 'Resume Clinic',
    date: '2026-05-18',
    location: 'Library Room 204',
    organizerId: organizerIds[2]
  },
  {
    title: 'Startup Pitch Practice',
    date: '2026-05-25',
    location: 'Innovation Hub',
    organizerId: organizerIds[1]
  }
];

const sampleVenues = [
  {
    name: 'Innovation Hall',
    building: 'Science Complex',
    capacity: 180
  },
  {
    name: 'Student Hub Theater',
    building: 'Student Center',
    capacity: 300
  },
  {
    name: 'Library Conference Room',
    building: 'Main Library',
    capacity: 60
  }
];

const buildSampleRegistrations = (eventIds) => [
  {
    eventId: eventIds[0],
    attendeeName: 'Alice Kato',
    attendeeEmail: 'alice.kato@campus.edu',
    status: 'registered'
  },
  {
    eventId: eventIds[1],
    attendeeName: 'Brian Nabende',
    attendeeEmail: 'brian.nabende@campus.edu',
    status: 'registered'
  },
  {
    eventId: eventIds[2],
    attendeeName: 'Carol Mirembe',
    attendeeEmail: 'carol.mirembe@campus.edu',
    status: 'waitlisted'
  },
  {
    eventId: eventIds[3],
    attendeeName: 'David Ssenfuma',
    attendeeEmail: 'david.ssenfuma@campus.edu',
    status: 'cancelled'
  }
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is required in environment variables');
  }

  const client = new MongoClient(encodeMongoURI(uri), {
    family: 4,
    retryWrites: true,
    writeConcern: { w: 'majority' },
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  });

  try {
    await client.connect();
    const db = client.db();

    const organizersCollection = db.collection('organizers');
    const eventsCollection = db.collection('events');
    const venuesCollection = db.collection('venues');
    const registrationsCollection = db.collection('registrations');

    await registrationsCollection.deleteMany({});
    await venuesCollection.deleteMany({});
    await eventsCollection.deleteMany({});
    await organizersCollection.deleteMany({});

    const organizerInsert = await organizersCollection.insertMany(sampleOrganizers);
    const organizerIds = Object.values(organizerInsert.insertedIds).map((id) => id.toString());

    const sampleEvents = buildSampleEvents(organizerIds);
    const eventInsert = await eventsCollection.insertMany(sampleEvents);
    const eventIds = Object.values(eventInsert.insertedIds).map((id) => id.toString());

    const venueInsert = await venuesCollection.insertMany(sampleVenues);
    const sampleRegistrations = buildSampleRegistrations(eventIds);
    const registrationInsert = await registrationsCollection.insertMany(sampleRegistrations);

    console.log(
      `Seed complete: ${organizerIds.length} organizers, ${Object.keys(eventInsert.insertedIds).length} events, ${Object.keys(venueInsert.insertedIds).length} venues, ${Object.keys(registrationInsert.insertedIds).length} registrations`
    );
  } finally {
    await client.close();
  }
};

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exit(1);
  });