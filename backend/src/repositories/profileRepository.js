// src/repositories/profileRepository.js

const prisma = require('../prisma');

async function findByUserId(userId) {
  return prisma.profile.findUnique({
    where: { userId },
  });
}

async function updateProfile(userId, data) {
  return prisma.profile.update({
    where: { userId },
    data,
  });
}

module.exports = {
  findByUserId,
  updateProfile,
};
