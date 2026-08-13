// src/services/applicationService.js

const applicationRepository = require('../repositories/applicationRepository');
const offerRepository = require('../repositories/offerRepository');

/**
 * Un étudiant postule à une offre.
 */
async function applyToOffer(applicationData, studentUser) {
  // Vérifier le rôle
  if (studentUser.role !== 'STUDENT') {
    throw new Error('Seuls les étudiants peuvent postuler.');
  }

  // Vérifier que l'offre existe et est active
  const offer = await offerRepository.findById(applicationData.offerId);

  if (!offer || !offer.isActive) {
    throw new Error('Offre introuvable ou inactive.');
  }

  // Vérifier les doublons
  const existing = await applicationRepository.findExistingApplication(
    studentUser.id,
    applicationData.offerId
  );

  if (existing) {
    throw new Error('Vous avez déjà postulé à cette offre.');
  }

  // Créer la candidature
  return applicationRepository.createApplication({
    offerId: applicationData.offerId,
    studentId: studentUser.id,
    message: applicationData.message,
    cvUrl: applicationData.cvUrl,
  });
}

/**
 * Récupère les candidatures de l'étudiant connecté.
 */
async function getStudentApplications(studentId) {
  return applicationRepository.findByStudent(studentId);
}

/**
 * Récupère les candidatures reçues par l'entreprise.
 */
async function getCompanyApplications(companyId) {
  return applicationRepository.findByCompany(companyId);
}

/**
 * Met à jour le statut d'une candidature.
 * Seule l'entreprise propriétaire de l'offre peut le faire.
 */
async function updateApplicationStatus(applicationId, status, companyUser) {
  const isOwner =
    await applicationRepository.isApplicationOwnedByCompany(
      applicationId,
      companyUser.id
    );

  if (!isOwner) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier cette candidature."
    );
  }

  return applicationRepository.updateStatus(applicationId, status);
}

module.exports = {
  applyToOffer,
  getStudentApplications,
  getCompanyApplications,
  updateApplicationStatus,
};
