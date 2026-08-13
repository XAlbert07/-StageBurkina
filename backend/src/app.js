// src/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./prisma');

// Routes
const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offerRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Middleware d'erreurs
const errorHandler = require('./middlewares/errorHandler');

// Charger les variables du fichier .env
dotenv.config();

// Créer l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
  });
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes des offres
app.use('/api/offers', offerRoutes);

// Routes des candidatures
app.use('/api/applications', applicationRoutes);

// Routes du profil
app.use('/api/profile', profileRoutes);

// Middleware global de gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
async function main() {
  try {
    await prisma.$connect();

    console.log('✅ Connexion à la base de données réussie');

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à la base :', error);
    process.exit(1);
  }
}

main();
