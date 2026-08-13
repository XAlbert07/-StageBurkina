// src/routes/auth.js

const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
} = require('../utils/validationSchemas');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

module.exports = router;
