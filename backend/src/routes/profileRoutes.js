// src/routes/profileRoutes.js

const express = require('express');

const profileController = require('../controllers/profileController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { profileUpdateSchema } = require('../utils/validationSchemas');

const router = express.Router();

// GET /api/profile/me
router.get(
  '/me',
  authenticate,
  profileController.getMyProfile
);

// PUT /api/profile/me
router.put(
  '/me',
  authenticate,
  validate(profileUpdateSchema),
  profileController.updateMyProfile
);

module.exports = router;
