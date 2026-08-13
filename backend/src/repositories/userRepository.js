// src/repositories/userRepository.js

const prisma = require('../prisma');

/**
 * Crée un utilisateur avec son profil.
 */
async function createUser(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      role: data.role,
      profile: {
        create: data.profile,
      },
    },
    include: {
      profile: true,
    },
  });
}

/**
 * Trouve un utilisateur par son email.
 */
async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
}

/**
 * Trouve un utilisateur par son id.
 */
async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
