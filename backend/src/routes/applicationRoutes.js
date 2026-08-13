// src/routes/applicationRoutes.js

const express = require('express');

const applicationController = require('../controllers/applicationController');
const validate = require('../middlewares/validate');

const {
  authenticate,
  authorize,
} = require('../middlewares/auth');

const {
  applicationCreateSchema,
  applicationStatusSchema,
} = require('../utils/validationSchemas');

const router = express.Router();

// =====================================
// Routes étudiant
// =====================================

// POST /api/applications
// Un étudiant postule à une offre
router.post(
  '/',
  authenticate,
  authorize('STUDENT'),
  validate(applicationCreateSchema),
  applicationController.applyToOffer
);

// GET /api/applications/student
// Voir les candidatures de l'étudiant connecté
router.get(
  '/student',
  authenticate,
  authorize('STUDENT'),
  applicationController.getStudentApplications
);

// =====================================
// Route entreprise
// =====================================

// GET /api/applications/company
// Voir les candidatures reçues par l'entreprise connectée
router.get(
  '/company',
  authenticate,
  authorize('COMPANY'),
  applicationController.getCompanyApplications
);

// PATCH /api/applications/:id/status
router.patch(
  '/:id/status',
  authenticate,
  authorize('COMPANY'),
  validate(applicationStatusSchema),
  applicationController.updateApplicationStatus
);

module.exports = router;
