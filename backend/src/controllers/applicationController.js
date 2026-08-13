// src/controllers/applicationController.js

const applicationService = require('../services/applicationService');

/**
 * Postuler à une offre.
 */
async function applyToOffer(req, res, next) {
  try {
    const application = await applicationService.applyToOffer(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    if (error.message === 'Seuls les étudiants peuvent postuler.') {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Offre introuvable ou inactive.') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Vous avez déjà postulé à cette offre.') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

/**
 * Voir les candidatures de l'étudiant connecté.
 */
async function getStudentApplications(req, res, next) {
  try {
    const applications =
      await applicationService.getStudentApplications(req.user.id);

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Voir les candidatures reçues par l'entreprise connectée.
 */
async function getCompanyApplications(req, res, next) {
  try {
    const applications =
      await applicationService.getCompanyApplications(req.user.id);

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
}


/**
 * Met à jour le statut d'une candidature.
 */
async function updateApplicationStatus(req, res, next) {
  try {
    const application =
      await applicationService.updateApplicationStatus(
        req.params.id,
        req.body.status,
        req.user
      );

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    if (error.message.includes("pas autorisé")) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

module.exports = {
  applyToOffer,
  getStudentApplications,
  getCompanyApplications,
  updateApplicationStatus,
};
