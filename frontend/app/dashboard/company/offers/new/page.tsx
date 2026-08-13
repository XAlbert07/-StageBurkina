'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';
import apiFetch from '@/services/api';

export default function NewOfferPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await apiFetch('/api/offers', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          requirements,
          duration,
          location,
        }),
      });

      router.push('/dashboard/company');
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

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">
          Publier une nouvelle offre
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg bg-white p-6 shadow"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium"
            >
              Titre
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
              placeholder="Ex : Stage Développeur Web"
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
              required
              rows={5}
              className="w-full rounded border px-3 py-2"
              placeholder="Décrivez le stage..."
            />
          </div>

          <div>
            <label
              htmlFor="requirements"
              className="mb-1 block text-sm font-medium"
            >
              Compétences requises
            </label>

            <input
              id="requirements"
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Ex : React, Node.js"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="mb-1 block text-sm font-medium"
            >
              Durée
            </label>

            <input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Ex : 3 mois"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium"
            >
              Localisation
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Ex : Ouagadougou"
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
            {loading ? 'Publication...' : 'Publier'}
          </button>
        </form>
      </main>
    </div>
  );
}
