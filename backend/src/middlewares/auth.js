// src/middlewares/auth.js

const jwt = require('jsonwebtoken');

/**
 * Vérifie le token JWT et attache les informations
 * de l'utilisateur à req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Token manquant.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré.',
    });
  }
}

/**
 * Vérifie que l'utilisateur possède l'un des rôles autorisés.
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Rôle insuffisant.',
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
