const express = require('express');
const { 
  createEvent, 
  updateEvent, 
  getEventById, 
  getLatestEvents, 
  deleteEvent 
} = require('../controllers/eventController');

const router = express.Router();

router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.get('/events', getEventById);
router.get('/events-letest', getLatestEvents);
router.delete('/events/:id', deleteEvent);

module.exports = router;
