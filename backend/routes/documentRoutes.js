const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadDocument');
const documentController = require('../controllers/documentController');

router.post('/:pet_id/upload', auth, upload.single('file'), documentController.uploadDocument);
router.get('/pet/:pet_id', auth, documentController.getDocumentsByPet);
router.delete('/:id', auth, documentController.deleteDocument);

module.exports = router;
