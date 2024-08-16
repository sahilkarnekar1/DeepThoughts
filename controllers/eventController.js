const { ObjectId } = require('mongodb');
const { getDB } = require('../services/dbService');

const createEvent = async (req, res) => {
  try {
    const db = getDB();
    const eventData = {
      type: 'event',
      uid: req.body.uid,
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: req.body.schedule,
      description: req.body.description,
      files: req.file ? req.file.path : null,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: parseInt(req.body.rigor_rank),
      attendees: req.body.attendees ? req.body.attendees.split(',') : []
    };

    const result = await db.collection('events').insertOne(eventData);
    res.status(201).send({ id: result.insertedId });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateEvent = async (req, res) => {
    try {
      const db = getDB();
      const eventId = req.params.id;
      const updateData = {};
  
      // Build updateData object dynamically based on the fields provided in the request body
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.tagline) updateData.tagline = req.body.tagline;
      if (req.body.schedule) updateData.schedule = req.body.schedule;
      if (req.body.description) updateData.description = req.body.description;
      if (req.file) updateData.files = req.file.path; // Assuming file upload is optional
      if (req.body.moderator) updateData.moderator = req.body.moderator;
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.sub_category) updateData.sub_category = req.body.sub_category;
      if (req.body.rigor_rank) updateData.rigor_rank = parseInt(req.body.rigor_rank);
      if (req.body.attendees) updateData.attendees = req.body.attendees.split(',');
  
      // Perform the update operation using $set
      const result = await db.collection('events').updateOne(
        { _id: new ObjectId(eventId) },
        { $set: updateData }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).send({ error: 'Event not found' });
      }
  
      res.send({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).send({ error: error.message });
    }
  };

const getEventById = async (req, res) => {
  try {
    const db = getDB();
    if (req.query.id) {
      const eventId = new ObjectId(req.query.id);
      const event = await db.collection('events').findOne({ _id: eventId });
      res.status(200).send(event);
    } else {
      res.status(400).send('Event ID is required');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getLatestEvents = async (req, res) => {
  try {
    const db = getDB();
    if (req.query.type === 'latest') {
      const limit = parseInt(req.query.limit) || 5;
      const page = parseInt(req.query.page) || 1;
      const events = await db.collection('events')
        .find({ type: 'event' })
        .sort({ schedule: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
      res.status(200).send(events);
    } else {
      res.status(400).send('Invalid query parameters');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const db = getDB();
    const eventId = new ObjectId(req.params.id);
    await db.collection('events').deleteOne({ _id: eventId });
    res.status(200).send({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  getEventById,
  getLatestEvents,
  deleteEvent
};
