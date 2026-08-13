// src/services/profileService.js

const profileRepository = require('../repositories/profileRepository');

async function getProfile(userId) {
  const profile = await profileRepository.findByUserId(userId);

  if (!profile) {
    throw new Error('Profil introuvable.');
  }

  return profile;
}

async function updateProfile(userId, profileData) {
  return profileRepository.updateProfile(userId, profileData);
}

module.exports = {
  getProfile,
  updateProfile,
};
