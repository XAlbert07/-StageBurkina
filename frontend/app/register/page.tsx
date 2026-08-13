'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import apiFetch from '@/services/api';
import Navbar from '@/components/Navbar';
import type { User } from '@/types';

interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

type Role = 'STUDENT' | 'COMPANY';

export default function RegisterPage() {
  const { login } = useAuth();

  const [role, setRole] = useState<Role>('STUDENT');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Étudiant
  const [studentInfo, setStudentInfo] = useState('');
  const [cvUrl, setCvUrl] = useState('');

  // Entreprise
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError('');
    setLoading(true);

    const profile = {
      fullName,
      phone,
      ...(role === 'STUDENT'
        ? {
            studentInfo,
            cvUrl,
          }
        : {
            companyName,
            sector,
            description,
            website,
          }),
    };

    try {
      const response = await apiFetch<RegisterResponse>(
        '/api/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            role,
            profile,
          }),
        }
      );

      login(response.data.token, response.data.user);

      if (role === 'COMPANY') {
        window.location.href = '/dashboard/company';
      } else {
        window.location.href = '/dashboard/student';
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Créer un compte
        </h1>

        <div className="mb-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`rounded px-4 py-2 ${
              role === 'STUDENT'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Étudiant
          </button>

          <button
            type="button"
            onClick={() => setRole('COMPANY')}
            className={`rounded px-4 py-2 ${
              role === 'COMPANY'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Entreprise
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg bg-white p-6 shadow"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium"
            >
              Nom complet
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium"
            >
              Téléphone
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {role === 'STUDENT' && (
            <>
              <div>
                <label
                  htmlFor="studentInfo"
                  className="mb-1 block text-sm font-medium"
                >
                  Formation / compétences
                </label>

                <input
                  id="studentInfo"
                  type="text"
                  value={studentInfo}
                  onChange={(e) => setStudentInfo(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="cvUrl"
                  className="mb-1 block text-sm font-medium"
                >
                  URL du CV
                </label>

                <input
                  id="cvUrl"
                  type="url"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {role === 'COMPANY' && (
            <>
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-1 block text-sm font-medium"
                >
                  Nom de l'entreprise
                </label>

                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="sector"
                  className="mb-1 block text-sm font-medium"
                >
                  Secteur d'activité
                </label>

                <input
                  id="sector"
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="mb-1 block text-sm font-medium"
                >
                  Site web
                </label>

                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Déjà un compte ?{' '}
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </main>
    </div>
  );
}
