'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import apiFetch from '@/services/api';
import Navbar from '@/components/Navbar';

interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      role: 'STUDENT' | 'COMPANY';
      profile?: {
        id: string;
        fullName?: string | null;
        phone?: string | null;
        avatarUrl?: string | null;
        studentInfo?: string | null;
        cvUrl?: string | null;
        companyName?: string | null;
        sector?: string | null;
        description?: string | null;
        website?: string | null;
      };
    };
    token: string;
  };
}

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await apiFetch<LoginResponse>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      login(response.data.token, response.data.user);

      if (response.data.user.role === 'COMPANY') {
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
          Connexion
        </h1>

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
              placeholder="votre@email.com"
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
              className="w-full rounded border px-3 py-2"
              placeholder="••••••"
            />
          </div>

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
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Pas de compte ?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:underline"
          >
            S'inscrire
          </Link>
        </p>
      </main>
    </div>
  );
}
