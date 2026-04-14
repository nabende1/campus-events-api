const { ObjectId } = require('mongodb');
const database = require('../data/database');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePayload = (payload, requireAll = false) => {
  const requiredFields = ['name', 'email', 'phone'];

  if (requireAll) {
    const missing = requiredFields.filter((field) => !payload[field]);
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
  }

  if (payload.email && !isValidEmail(payload.email)) {
    return 'email must be a valid email address';
  }

  return null;
};

const getCollection = () => database.getDatabase().collection('organizers');

const getAll = async (req, res) => {
  try {
    const results = await getCollection().find({}).toArray();
    res.status(200).json(results);
  } catch {
    res.status(500).json({ error: 'Failed to fetch organizers' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid organizer ID format' });
    }

    const result = await getCollection().findOne({ _id: new ObjectId(req.params.id) });
    if (!result) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch organizer' });
  }
};

const create = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    const validationError = validatePayload(payload, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existing = await getCollection().findOne({ email: payload.email });
    if (existing) {
      return res.status(409).json({ error: 'Organizer with that email already exists' });
    }

    const response = await getCollection().insertOne(payload);
    res.status(201).json({ message: 'Organizer created', id: response.insertedId });
  } catch {
    res.status(500).json({ error: 'Failed to create organizer' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid organizer ID format' });
    }

    const payload = {
      ...(req.body.name !== undefined && { name: req.body.name }),
      ...(req.body.email !== undefined && { email: req.body.email }),
      ...(req.body.phone !== undefined && { phone: req.body.phone })
    };

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'At least one field is required for update' });
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (payload.email) {
      const duplicate = await getCollection().findOne({
        email: payload.email,
        _id: { $ne: new ObjectId(req.params.id) }
      });
      if (duplicate) {
        return res.status(409).json({ error: 'Another organizer already uses that email' });
      }
    }

    const response = await getCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: payload }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.status(200).json({ message: 'Organizer updated' });
  } catch {
    res.status(500).json({ error: 'Failed to update organizer' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid organizer ID format' });
    }

    const response = await getCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.status(200).json({ message: 'Organizer deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete organizer' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };
