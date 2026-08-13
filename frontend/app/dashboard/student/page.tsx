'use client';

import { useEffect, useState } from 'react';

import Navbar from '@/components/Navbar';
import apiFetch from '@/services/api';
import type { Application } from '@/types';

interface ApplicationsResponse {
  success: boolean;
  data: Application[];
}

export default function StudentDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await apiFetch<ApplicationsResponse>(
          '/api/applications/student'
        );

        setApplications(response.data);
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

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">
          Mes candidatures
        </h1>

        {loading && (
          <p className="text-center text-gray-600">
            Chargement...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600">
            Erreur : {error}
          </p>
        )}

        {!loading && !error && applications.length === 0 && (
          <p className="text-center text-gray-500">
            Vous n&apos;avez postulé à aucune offre pour le moment.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <h2 className="mb-2 text-xl font-semibold">
                {application.offer?.title || 'Offre supprimée'}
              </h2>

              {application.offer?.company?.profile?.companyName && (
                <p className="mb-2 text-sm text-gray-600">
                  Entreprise :{' '}
                  {application.offer.company.profile.companyName}
                </p>
              )}

              <p className="mb-3 text-sm text-gray-500">
                Postulé le{' '}
                {new Date(application.createdAt).toLocaleDateString(
                  'fr-FR'
                )}
              </p>

              <div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    application.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {application.status === 'pending'
                    ? 'En attente'
                    : application.status === 'accepted'
                      ? 'Acceptée'
                      : 'Refusée'}
                </span>
              </div>

              {application.message && (
                <p className="mt-3 text-sm">
                  {application.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
