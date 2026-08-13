// src/controllers/authController.js

const authService = require('../services/authService');

/**
 * Inscription
 */
async function register(req, res, next) {
  try {
    const { email, password, role, profile } = req.body;

    const result = await authService.register({
      email,
      password,
      role,
      profile,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Connexion
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await authService.login({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
