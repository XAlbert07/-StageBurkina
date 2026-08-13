'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Navbar from '@/components/Navbar';
import apiFetch from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { Application, Offer } from '@/types';

interface OfferResponse {
  success: boolean;
  data: Offer;
}

interface ApplicationsResponse {
  success: boolean;
  data: Application[];
}

export default function OfferDetailPage() {
  const params = useParams<{ id: string }>();
  const offerId = params.id;

  const { user } = useAuth();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [message, setMessage] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Récupérer l'offre
  useEffect(() => {
    async function fetchOffer() {
      try {
        const response = await apiFetch<OfferResponse>(
          `/api/offers/${offerId}`
        );

        setOffer(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Une erreur est survenue.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOffer();
  }, [offerId]);

  // Vérifier si l'étudiant a déjà postulé
  useEffect(() => {
    if (!user || user.role !== 'STUDENT') {
      return;
    }

    async function checkApplication() {
      try {
        const response =
          await apiFetch<ApplicationsResponse>(
            '/api/applications/student'
          );

        const hasApplied = response.data.some(
          (application) => application.offerId === offerId
        );

        setAlreadyApplied(hasApplied);
      } catch (err) {
        console.error(err);
      }
    }

    checkApplication();
  }, [user, offerId]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setFormError('');
    setSubmitting(true);

    try {
      await apiFetch('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
          offerId,
          message,
          cvUrl,
        }),
      });

      setAlreadyApplied(true);
      setMessage('');
      setCvUrl('');

      alert('Candidature envoyée avec succès !');
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-8 text-center">
          Chargement...
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-8 text-center text-red-600">
          Erreur : {error}
        </main>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-8 text-center">
          Offre introuvable.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="mb-4 inline-block text-blue-600 hover:underline"
        >
          ← Retour aux offres
        </Link>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-3xl font-bold">
            {offer.title}
          </h1>

          <div className="mb-6 text-gray-700">
            <p className="mb-2">
              <span className="font-semibold">
                Entreprise :
              </span>{' '}
              {offer.company?.profile?.companyName ||
                'Non spécifiée'}
            </p>

            {offer.location && (
              <p className="mb-2">
                <span className="font-semibold">
                  Lieu :
                </span>{' '}
                {offer.location}
              </p>
            )}

            {offer.duration && (
              <p className="mb-2">
                <span className="font-semibold">
                  Durée :
                </span>{' '}
                {offer.duration}
              </p>
            )}

            {offer.requirements && (
              <p className="mb-2">
                <span className="font-semibold">
                  Compétences requises :
                </span>{' '}
                {offer.requirements}
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">
              Description
            </h2>

            <p className="whitespace-pre-wrap">
              {offer.description}
            </p>
          </div>

          {/* Étudiant non candidat */}
          {user?.role === 'STUDENT' && !alreadyApplied && (
            <div className="mt-8 border-t pt-6">
              <h2 className="mb-4 text-xl font-semibold">
                Postuler à cette offre
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium"
                  >
                    Message (optionnel)
                  </label>

                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    rows={4}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Parlez de votre motivation, de vos compétences..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvUrl"
                    className="mb-1 block text-sm font-medium"
                  >
                    Lien vers votre CV (optionnel)
                  </label>

                  <input
                    id="cvUrl"
                    type="url"
                    value={cvUrl}
                    onChange={(e) =>
                      setCvUrl(e.target.value)
                    }
                    className="w-full rounded border px-3 py-2"
                    placeholder="https://..."
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-600">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting
                    ? 'Envoi...'
                    : 'Envoyer ma candidature'}
                </button>
              </form>
            </div>
          )}

          {/* Étudiant déjà candidat */}
          {user?.role === 'STUDENT' && alreadyApplied && (
            <div className="mt-8 border-t pt-6 text-center">
              <p className="font-medium text-green-600">
                Vous avez déjà postulé à cette offre.
              </p>
            </div>
          )}

          {/* Visiteur */}
          {!user && (
            <div className="mt-8 border-t pt-6 text-center">
              <p className="mb-4">
                Connectez-vous en tant qu&apos;étudiant
                pour postuler.
              </p>

              <Link
                href="/login"
                className="inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Se connecter
              </Link>
            </div>
          )}

          {/* Entreprise */}
          {user?.role === 'COMPANY' && (
            <div className="mt-8 border-t pt-6 text-center text-gray-600">
              Les entreprises ne peuvent pas postuler.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
