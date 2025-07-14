const { Event, Pet, User } = require('../models');

exports.createEvent = async (req, res) => {
  try {
    const { petId } = req.params;
    const { title, description, date, time, type, repeat, notes, status } = req.body;

    const pet = await Pet.findByPk(petId);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    const event = await Event.create({
      title,
      description,
      date,
      time,
      type,
      repeat,
      notes,
      status,
      pet_id: petId,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventsByPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const events = await Event.findAll({ where: { pet_id: petId } });
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
    const { id } = req.params;
    const [updated] = await Event.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    const updatedEvent = await Event.findByPk(id);
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
