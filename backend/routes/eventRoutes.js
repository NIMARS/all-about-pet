const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post(
  '/',
  authMiddleware,
  checkRole(['admin', 'owner', 'vet', 'volunteer']),
  eventController.createEvent
);

router.use(authMiddleware); // little protection

// /api/pets/:petId/events
router.post('/pets/:petId/events', eventController.createEvent);
router.get('/pets/:petId/events', eventController.getEventsByPet);

// /api/events/:id
router.get('/events/:id', eventController.getEventById);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
