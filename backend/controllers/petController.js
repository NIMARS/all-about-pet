// /controllers/petController.js
const { Pet, User, UserPet } = require('../models');

exports.getAllPets = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Pet,
        as: 'pets',
      },
    });

    res.json(user.pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Access dinied to pets' });
  }
};


exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'users',
        where: { id: req.user.id },
        required: true,
      },
    });

    if (!pet) {
      return res.status(404).json({ message: 'Not found or access not granted' });
    }

    res.json(pet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Access dinied to pet' });
  }
};

exports.createPet = async (req, res) => {
  try {
    const { name, species, breed, color, birthday, birthplace, location, bio, photo_url, privacy } = req.body;
    const userId = req.user.id;

    const newPet = await Pet.create({
      name,
      species,
      breed,
      color,
      birthday,
      birthplace,
      location,
      bio,
      photo_url,
      privacy
    });

    // Ассоциируем питомца с пользователем
    const user = await User.findByPk(userId);
    await user.addPet(newPet); // Sequelize magic method

    res.status(201).json(newPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании питомца' });
  }
};


exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    await pet.update(req.body);
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update pet' });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet_id = req.params.id;
    const user = req.user;

    const pet = await Pet.findByPk(pet_id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    if (user.role !== 'admin') {
      const userPet = await UserPet.findOne({ where: { user_id: user.id, pet_id } });
      if (!userPet) return res.status(403).json({ message: 'Access denied to this pet' });
    }

    await pet.destroy();
    res.json({ message: 'Pet deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting pet' });
  }
};
