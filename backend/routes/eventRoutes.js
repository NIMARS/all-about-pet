const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// /api/pets/:petId/events
router.post('/pets/:petId/events', eventController.createEvent);
router.get('/pets/:petId/events', eventController.getEventsByPet);

// /api/events/:id
router.get('/events/:id', eventController.getEventById);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
