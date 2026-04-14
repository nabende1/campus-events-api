const { ObjectId } = require('mongodb');
const database = require('../data/database');

const requiredFields = ['eventId', 'attendeeName', 'attendeeEmail', 'status'];
const allowedStatuses = ['registered', 'waitlisted', 'cancelled'];

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePayload = (payload, requireAll = false) => {
  if (requireAll) {
    const missing = requiredFields.filter((field) => !payload[field]);
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
  }

  if (payload.eventId && !ObjectId.isValid(payload.eventId)) {
    return 'eventId must be a valid MongoDB ObjectId';
  }

  if (payload.attendeeEmail && !isValidEmail(payload.attendeeEmail)) {
    return 'attendeeEmail must be a valid email address';
  }

  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return `status must be one of: ${allowedStatuses.join(', ')}`;
  }

  return null;
};

const getCollection = () => database.getDatabase().collection('registrations');

const getAll = async (req, res) => {
  try {
    const results = await getCollection().find({}).toArray();
    return res.status(200).json(results);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid registration ID format' });
    }

    const result = await getCollection().findOne({ _id: new ObjectId(req.params.id) });
    if (!result) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch registration' });
  }
};

const create = async (req, res) => {
  try {
    const payload = {
      eventId: req.body.eventId,
      attendeeName: req.body.attendeeName,
      attendeeEmail: req.body.attendeeEmail,
      status: req.body.status
    };

    const validationError = validatePayload(payload, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const response = await getCollection().insertOne(payload);
    return res.status(201).json({ message: 'Registration created', id: response.insertedId });
  } catch {
    return res.status(500).json({ error: 'Failed to create registration' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid registration ID format' });
    }

    const payload = {
      ...(req.body.eventId !== undefined && { eventId: req.body.eventId }),
      ...(req.body.attendeeName !== undefined && { attendeeName: req.body.attendeeName }),
      ...(req.body.attendeeEmail !== undefined && { attendeeEmail: req.body.attendeeEmail }),
      ...(req.body.status !== undefined && { status: req.body.status })
    };

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'At least one field is required for update' });
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const response = await getCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: payload }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    return res.status(200).json({ message: 'Registration updated' });
  } catch {
    return res.status(500).json({ error: 'Failed to update registration' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid registration ID format' });
    }

    const response = await getCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    return res.status(200).json({ message: 'Registration deleted' });
  } catch {
    return res.status(500).json({ error: 'Failed to delete registration' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };