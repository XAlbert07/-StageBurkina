// src/services/authService.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

/**
 * Inscription d'un utilisateur.
 */
async function register(userData) {
  // Vérifier si l'email existe déjà
  const existingUser = await userRepository.findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error('Cet email est déjà utilisé.');
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Préparer les données pour la création
  const userToCreate = {
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    profile: userData.profile,
  };

  // Créer l'utilisateur
  const user = await userRepository.createUser(userToCreate);

  // Générer le token JWT
  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

/**
 * Connexion d'un utilisateur.
 */
async function login(credentials) {
  // Chercher l'utilisateur
  const user = await userRepository.findUserByEmail(credentials.email);

  if (!user) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Générer le token
  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

/**
 * Génère le token JWT.
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Retire le mot de passe avant d'envoyer l'utilisateur au client.
 */
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  register,
  login,
};
