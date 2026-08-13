// src/controllers/offerController.js

const offerService = require('../services/offerService');

/**
 * Liste toutes les offres actives.
 */
async function listOffers(req, res, next) {
  try {
    const offers = await offerService.getAllOffers();

    res.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Récupère une offre par son id.
 */
async function getOffer(req, res, next) {
  try {
    const offer = await offerService.getOfferById(req.params.id);

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    if (error.message === 'Offre introuvable.') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

/**
 * Crée une offre.
 */
async function createOffer(req, res, next) {
  try {
    const offer = await offerService.createOffer(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    if (
      error.message ===
      'Seules les entreprises peuvent créer des offres.'
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

/**
 * Modifie une offre.
 */
async function updateOffer(req, res, next) {
  try {
    const offer = await offerService.updateOffer(
      req.params.id,
      req.body,
      req.user
    );

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    if (error.message.includes('pas autorisé')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Offre introuvable.') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

/**
 * Supprime une offre.
 */
async function deleteOffer(req, res, next) {
  try {
    await offerService.deleteOffer(
      req.params.id,
      req.user
    );

    res.json({
      success: true,
      message: 'Offre supprimée avec succès.',
    });
  } catch (error) {
    if (error.message.includes('pas autorisé')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Offre introuvable.') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

module.exports = {
  listOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
};
