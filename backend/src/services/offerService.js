// src/services/offerService.js

const offerRepository = require('../repositories/offerRepository');

/**
 * Récupère toutes les offres actives.
 */
async function getAllOffers() {
  return offerRepository.findAllActive();
}

/**
 * Récupère une offre par son id.
 */
async function getOfferById(id) {
  const offer = await offerRepository.findById(id);

  if (!offer) {
    throw new Error('Offre introuvable.');
  }

  return offer;
}

/**
 * Crée une offre (réservé aux entreprises).
 */
async function createOffer(offerData, companyUser) {
  // Double sécurité : vérifier le rôle de l'utilisateur.
  if (companyUser.role !== 'COMPANY') {
    throw new Error('Seules les entreprises peuvent créer des offres.');
  }

  return offerRepository.createOffer({
    ...offerData,
    companyId: companyUser.id,
  });
}

/**
 * Met à jour une offre (uniquement l'entreprise propriétaire).
 */
async function updateOffer(offerId, updateData, companyUser) {
  const isOwner = await offerRepository.isOfferOwnedByCompany(
    offerId,
    companyUser.id
  );

  if (!isOwner) {
    throw new Error("Vous n'êtes pas autorisé à modifier cette offre.");
  }

  return offerRepository.updateOffer(offerId, updateData);
}

/**
 * Supprime une offre (uniquement l'entreprise propriétaire).
 */
async function deleteOffer(offerId, companyUser) {
  const isOwner = await offerRepository.isOfferOwnedByCompany(
    offerId,
    companyUser.id
  );

  if (!isOwner) {
    throw new Error("Vous n'êtes pas autorisé à supprimer cette offre.");
  }

  return offerRepository.deleteOffer(offerId);
}

module.exports = {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
