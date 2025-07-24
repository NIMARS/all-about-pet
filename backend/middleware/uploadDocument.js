const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/documents';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const petId = req.params.pet_id || 'unknown';
    const ext = path.extname(file.originalname);
    const base = path.parse(file.originalname).name;
    const timestamp = Date.now();
    cb(null, `${base}_pet${petId}_${timestamp}${ext}`);
  }
});
 
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
