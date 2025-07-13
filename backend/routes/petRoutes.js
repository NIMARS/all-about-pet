const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // защита всех роутов ниже

router.get('/', authMiddleware, petController.getAllPets);
router.get('/:id', authMiddleware, petController.getPetById);
router.post('/', authMiddleware, petController.createPet);
router.put('/:id', authMiddleware, petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;
