// src/utils/validationSchemas.js

const { z } = require('zod');

// ==========================
// Validation de l'inscription
// ==========================
const registerSchema = z.object({
  email: z.string().email('Email invalide'),

  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),

  role: z.enum(['STUDENT', 'COMPANY']),

  profile: z.object({
    fullName: z.string().min(1, 'Le nom complet est requis'),
    phone: z.string().optional(),
    avatarUrl: z.string().optional(),
    studentInfo: z.string().optional(),
    cvUrl: z.string().optional(),
    companyName: z.string().optional(),
    sector: z.string().optional(),
    description: z.string().optional(),
    website: z.string().optional(),
  }),
});

// ==========================
// Validation de la connexion
// ==========================
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// ==========================
// Validation de la création d'une offre
// ==========================
const offerCreateSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),

  description: z
    .string()
    .min(1, 'La description est requise'),

  requirements: z.string().optional(),

  duration: z.string().optional(),

  location: z.string().optional(),
});

// ==========================
// Validation de la modification d'une offre
// ==========================
const offerUpdateSchema = z.object({
  title: z.string().min(1).optional(),

  description: z.string().min(1).optional(),

  requirements: z.string().nullable().optional(),

  duration: z.string().nullable().optional(),

  location: z.string().nullable().optional(),

  isActive: z.boolean().optional(),
});

const applicationCreateSchema = z.object({
  offerId: z
    .string()
    .min(1, "L'identifiant de l'offre est requis"),

  message: z.string().optional(),

  cvUrl: z.string().optional(),
});


const profileUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  studentInfo: z.string().nullable().optional(),
  cvUrl: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  sector: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
});

const applicationStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected']),
});

// ==========================
// Export
// ==========================
module.exports = {
  registerSchema,
  loginSchema,
  offerCreateSchema,
  offerUpdateSchema,
  applicationCreateSchema,
  profileUpdateSchema,
  applicationStatusSchema,
};
