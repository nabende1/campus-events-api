const { ObjectId } = require('mongodb');
const database = require('../data/database');

const requiredFields = ['title', 'date', 'location', 'organizerId'];

const validatePayload = (payload, requireAll = false) => {
  if (requireAll) {
    const missing = requiredFields.filter((field) => !payload[field]);
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
  }

  if (payload.date && Number.isNaN(Date.parse(payload.date))) {
    return 'date must be a valid date string';
  }

  if (payload.organizerId && !ObjectId.isValid(payload.organizerId)) {
    return 'organizerId must be a valid MongoDB ObjectId';
  }

  return null;
};

const getCollection = () => database.getDatabase().collection('events');

const getAll = async (req, res) => {
  try {
    const results = await getCollection().find({}).toArray();
    res.status(200).json(results);
  } catch {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const result = await getCollection().findOne({ _id: new ObjectId(req.params.id) });
    if (!result) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

const create = async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
      organizerId: req.body.organizerId
    };

    const validationError = validatePayload(payload, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const response = await getCollection().insertOne(payload);
    res.status(201).json({ message: 'Event created', id: response.insertedId });
  } catch {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const payload = {
      ...(req.body.title !== undefined && { title: req.body.title }),
      ...(req.body.date !== undefined && { date: req.body.date }),
      ...(req.body.location !== undefined && { location: req.body.location }),
      ...(req.body.organizerId !== undefined && { organizerId: req.body.organizerId })
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
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated' });
  } catch {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const response = await getCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };
