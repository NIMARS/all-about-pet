const express = require('express');
const router = express.Router();
const petController =  require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole =      require('../middleware/roleMiddleware');

router.use(authMiddleware); // little protection

router.get('/', authMiddleware, petController.getAllPets);
router.get('/:id', authMiddleware, petController.getPetById);
router.post('/', authMiddleware, petController.createPet);
router.put('/:id', authMiddleware, petController.updatePet);

router.delete(
    '/:pet_id',
    authMiddleware,
    checkRole(['admin']),
    petController.deletePet
  );
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;
