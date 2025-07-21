const { Document, Pet, UserPet } = require('../models');
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    const { pet_id } = req.params;
    const { description } = req.body;
    const user_id = req.user.id;

    const hasAccess = await UserPet.findOne({ where: { user_id, pet_id } });
    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    const pet = await Pet.findByPk(pet_id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });


    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const doc = await Document.create({
      filename: file.filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      file_url: `/uploads/documents/${file.filename}`,
      description,
      pet_id,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

exports.getDocumentsByPet = async (req, res) => {
  try {
    const { pet_id } = req.params;
    const user_id = req.user.id;

    const hasAccess = await UserPet.findOne({ where: { user_id, pet_id } });
    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    const docs = await Document.findAll({ where: { pet_id }, order: [['uploaded_at', 'DESC']] });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get documents' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const hasAccess = await UserPet.findOne({ where: { user_id, pet_id: doc.pet_id } });
    if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

    const filePath = path.join(__dirname, '..', 'uploads', 'documents', doc.filename);
    fs.unlinkSync(filePath);

    await doc.destroy();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete document' });
  }
};
