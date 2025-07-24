const jwt = require('jsonwebtoken');
const { User, Pet } = require('../models');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }

    // если есть pet_id в маршруте - проверим принадлежность
    if (req.params.pet_id) {
      const pet = await Pet.findByPk(req.params.pet_id, {
        include: {
          model: User,
          as: 'users',
          where: { id: decoded.id },
          through: { attributes: [] },
        },
      });

      if (!pet) {
        return res.status(403).json({ message: 'Access denied to this pet' });
      }
    }

    next();
  } catch (err) {
    console.error('❌ Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
