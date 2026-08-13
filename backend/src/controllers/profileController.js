// src/controllers/profileController.js

const profileService = require('../services/profileService');

async function getMyProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile(req.user.id);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMyProfile(req, res, next) {
  try {
    const profile = await profileService.updateProfile(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
};
