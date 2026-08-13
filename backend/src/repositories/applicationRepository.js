// src/repositories/applicationRepository.js

const prisma = require('../prisma');

/**
 * Vérifie si l'étudiant a déjà postulé à cette offre.
 */
async function findExistingApplication(studentId, offerId) {
  return prisma.application.findFirst({
    where: {
      studentId,
      offerId,
    },
  });
}

/**
 * Crée une candidature.
 * Les données sensibles de l'étudiant ne sont pas retournées.
 */
async function createApplication(data) {
  return prisma.application.create({
    data: {
      offerId: data.offerId,
      studentId: data.studentId,
      message: data.message || null,
      cvUrl: data.cvUrl || null,
      status: 'pending',
    },
    include: {
      offer: true,
      student: {
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
 * Liste les candidatures d'un étudiant.
 */
async function findByStudent(studentId) {
  return prisma.application.findMany({
    where: {
      studentId,
    },
    include: {
      offer: {
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
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Liste les candidatures reçues par une entreprise.
 */
async function findByCompany(companyId) {
  return prisma.application.findMany({
    where: {
      offer: {
        companyId,
      },
    },
    include: {
      offer: true,
      student: {
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Récupère une candidature par son id.
 */
async function findById(id) {
  return prisma.application.findUnique({
    where: {
      id,
    },
    include: {
      offer: true,
      student: {
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
 * Vérifie si la candidature appartient à une offre
 * de l'entreprise donnée.
 */
async function isApplicationOwnedByCompany(applicationId, companyId) {
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      offer: true,
    },
  });

  return application?.offer.companyId === companyId;
}

/**
 * Met à jour le statut d'une candidature.
 */
async function updateStatus(applicationId, status) {
  return prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status,
    },
    include: {
      offer: true,
      student: {
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

module.exports = {
  findExistingApplication,
  createApplication,
  findByStudent,
  findByCompany,
  findById,
  isApplicationOwnedByCompany,
  updateStatus,
};
