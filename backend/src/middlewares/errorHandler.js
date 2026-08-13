// src/middlewares/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error('Erreur:', err);

  // Erreur de validation Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Erreur Prisma : contrainte unique
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Une valeur unique existe déjà.',
    });
  }

  // Erreur générique
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur.',
  });
}

module.exports = errorHandler;
