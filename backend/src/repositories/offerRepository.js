// src/repositories/offerRepository.js

const prisma = require('../prisma');

/**
 * Liste toutes les offres actives, avec les infos publiques de l'entreprise.
 */
async function findAllActive() {
  return prisma.offer.findMany({
    where: { isActive: true },
    include: {
      company: {
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Trouve une offre par son id, avec les infos publiques de l'entreprise.
 */
async function findById(id) {
  return prisma.offer.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
        },
      },
    },
  });
}

/**
 * Crée une offre.
 */
async function createOffer(data) {
  return prisma.offer.create({
    data: {
      title: data.title,
      description: data.description,
      requirements: data.requirements || null,
      duration: data.duration || null,
      location: data.location || null,
      companyId: data.companyId,
    },
    include: {
      company: {
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
        },
      },
    },
  });
}

/**
 * Met à jour une offre.
 */
async function updateOffer(id, data) {
  return prisma.offer.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      duration: data.duration,
      location: data.location,
      isActive: data.isActive,
    },
    include: {
      company: {
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
        },
      },
    },
  });
}

/**
 * Supprime une offre.
 */
async function deleteOffer(id) {
  return prisma.offer.delete({
    where: { id },
  });
}

/**
 * Vérifie si l'offre appartient à l'entreprise donnée.
 */
async function isOfferOwnedByCompany(offerId, companyId) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { companyId: true },
  });

  return offer?.companyId === companyId;
}

module.exports = {
  findAllActive,
  findById,
  createOffer,
  updateOffer,
  deleteOffer,
  isOfferOwnedByCompany,
};
