// src/routes/offerRoutes.js

const express = require('express');

const offerController = require('../controllers/offerController');

const validate = require('../middlewares/validate');

const {
  authenticate,
  authorize,
} = require('../middlewares/auth');

const {
  offerCreateSchema,
  offerUpdateSchema,
} = require('../utils/validationSchemas');

const router = express.Router();

// =====================================
// Routes publiques
// =====================================

// GET /api/offers
router.get('/', offerController.listOffers);

// GET /api/offers/:id
router.get('/:id', offerController.getOffer);

// =====================================
// Routes protégées
// Entreprise uniquement
// =====================================

// POST /api/offers
router.post(
  '/',
  authenticate,
  authorize('COMPANY'),
  validate(offerCreateSchema),
  offerController.createOffer
);

// PUT /api/offers/:id
router.put(
  '/:id',
  authenticate,
  authorize('COMPANY'),
  validate(offerUpdateSchema),
  offerController.updateOffer
);

// DELETE /api/offers/:id
router.delete(
  '/:id',
  authenticate,
  authorize('COMPANY'),
  offerController.deleteOffer
);

module.exports = router;
