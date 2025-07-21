const { Event, Pet, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, date, pet_id } = req.query;

    const petLinks = await UserPet.findAll({ where: { user_id: userId } });
    const petIds = petLinks.map(link => link.pet_id);

    const filter = {
      pet_id: pet_id ? pet_id : petIds,
    };

    if (status) filter.status = status;
    if (date) filter.event_date = date;

    const events = await Event.findAll({
      where: filter,
      include: [{ model: Pet, as: 'pet', attributes: ['id', 'name'] }],
    });

    res.json(events);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch events', error: e.message });
  }
};


exports.createEvent = async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        id, title, description, event_date, type,
        repeat, notes, status, pet_id,
      } = req.body;
  
      const link = await UserPet.findOne({ where: { user_id: userId, pet_id } });
      if (!link) return res.status(403).json({ message: 'Pet not linked to user' });
  
      const event = await Event.create({
        title, description, event_date, type,
        repeat, notes, status, pet_id,
      });
  
      res.status(201).json(event);
    } catch (e) {
      res.status(500).json({ message: 'Failed to create event', error: e.message });
    }
  };

exports.getEventsByPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const events    = await Event.findAll({ where: { pet_id: petId } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
    try {
      const userId  = req.user.id;
      const eventId = req.params.id;
      const event   = await Event.findByPk(eventId);
  
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      const link = await UserPet.findOne({ where: { user_id: userId, pet_id: event.pet_id } });
      if (!link) return res.status(403).json({ message: 'Access denied to this event' });
  
      await event.update(req.body);
      res.json(event);
    } catch (e) {
      res.status(500).json({ message: 'Failed to update event', error: e.message });
    }
  };

exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    const link = await UserPet.findOne({ where: { user_id: userId, pet_id: event.pet_id } });
    if (!link) return res.status(403).json({ message: 'Access denied to this event' });

    await event.destroy();
    res.json({ message: 'Event deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete event', error: e.message });
  }
};
