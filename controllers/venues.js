const { ObjectId } = require('mongodb');
const database = require('../data/database');

const requiredFields = ['name', 'building', 'capacity'];

const validatePayload = (payload, requireAll = false) => {
  if (requireAll) {
    const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === '');
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
  }

  if (payload.capacity !== undefined) {
    const capacityNumber = Number(payload.capacity);
    if (!Number.isInteger(capacityNumber) || capacityNumber <= 0) {
      return 'capacity must be a positive integer';
    }
  }

  return null;
};

const getCollection = () => database.getDatabase().collection('venues');

const getAll = async (req, res) => {
  try {
    const results = await getCollection().find({}).toArray();
    res.status(200).json(results);
  } catch {
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid venue ID format' });
    }

    const result = await getCollection().findOne({ _id: new ObjectId(req.params.id) });
    if (!result) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch venue' });
  }
};

const create = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      building: req.body.building,
      capacity: req.body.capacity
    };

    const validationError = validatePayload(payload, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    payload.capacity = Number(payload.capacity);

    const response = await getCollection().insertOne(payload);
    return res.status(201).json({ message: 'Venue created', id: response.insertedId });
  } catch {
    return res.status(500).json({ error: 'Failed to create venue' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid venue ID format' });
    }

    const payload = {
      ...(req.body.name !== undefined && { name: req.body.name }),
      ...(req.body.building !== undefined && { building: req.body.building }),
      ...(req.body.capacity !== undefined && { capacity: req.body.capacity })
    };

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'At least one field is required for update' });
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (payload.capacity !== undefined) {
      payload.capacity = Number(payload.capacity);
    }

    const response = await getCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: payload }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    return res.status(200).json({ message: 'Venue updated' });
  } catch {
    return res.status(500).json({ error: 'Failed to update venue' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid venue ID format' });
    }

    const response = await getCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    return res.status(200).json({ message: 'Venue deleted' });
  } catch {
    return res.status(500).json({ error: 'Failed to delete venue' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };