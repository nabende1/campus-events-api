process.env.AUTH_DISABLED = 'true';

const request = require('supertest');
const { ObjectId } = require('mongodb');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

const database = require('../data/database');
const app = require('../app');

const collections = {};

const toDocsWithId = (docs) => docs.map((doc) => ({ _id: new ObjectId(doc._id), ...doc }));

const buildCollection = (name) => ({
  find: jest.fn(() => ({
    toArray: jest.fn(async () => collections[name])
  })),
  findOne: jest.fn(async (query) =>
    collections[name].find((doc) => doc._id.toString() === query._id.toString()) || null
  )
});

beforeEach(() => {
  collections.events = toDocsWithId([
    {
      _id: '6801234567890abcde123451',
      title: 'Hack Night',
      date: '2026-05-03',
      location: 'Engineering Lab A',
      organizerId: '6801234567890abcde123401'
    }
  ]);

  collections.organizers = toDocsWithId([
    {
      _id: '6801234567890abcde123401',
      name: 'Campus Tech Society',
      email: 'techsociety@campus.edu',
      phone: '555-010-1001'
    }
  ]);

  collections.venues = toDocsWithId([
    {
      _id: '6801234567890abcde123461',
      name: 'Innovation Hall',
      building: 'Science Complex',
      capacity: 180
    }
  ]);

  collections.registrations = toDocsWithId([
    {
      _id: '6801234567890abcde123471',
      eventId: '6801234567890abcde123451',
      attendeeName: 'Jane Doe',
      attendeeEmail: 'jane@campus.edu',
      status: 'registered'
    }
  ]);

  database.getDatabase.mockReturnValue({
    collection: (name) => buildCollection(name)
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET endpoint coverage for all collections', () => {
  test('GET /events returns events list', async () => {
    const response = await request(app).get('/events');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('title', 'Hack Night');
  });

  test('GET /events/:id returns one event', async () => {
    const response = await request(app).get('/events/6801234567890abcde123451');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('location', 'Engineering Lab A');
  });

  test('GET /organizers returns organizers list', async () => {
    const response = await request(app).get('/organizers');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('name', 'Campus Tech Society');
  });

  test('GET /organizers/:id returns one organizer', async () => {
    const response = await request(app).get('/organizers/6801234567890abcde123401');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'techsociety@campus.edu');
  });

  test('GET /venues returns venues list', async () => {
    const response = await request(app).get('/venues');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('name', 'Innovation Hall');
  });

  test('GET /venues/:id returns one venue', async () => {
    const response = await request(app).get('/venues/6801234567890abcde123461');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('capacity', 180);
  });

  test('GET /registrations returns registrations list', async () => {
    const response = await request(app).get('/registrations');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('attendeeName', 'Jane Doe');
  });

  test('GET /registrations/:id returns one registration', async () => {
    const response = await request(app).get('/registrations/6801234567890abcde123471');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'registered');
  });
});