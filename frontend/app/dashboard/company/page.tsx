'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import RouteGuard from '@/components/RouteGuard';
import apiFetch from '@/services/api';
import type { Application, Offer } from '@/types';

interface OffersResponse {
  success: boolean;
  data: Offer[];
}

interface ApplicationsResponse {
  success: boolean;
  data: Application[];
}

export default function CompanyDashboard() {
  const { user } = useAuth();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const offersResponse = await apiFetch<OffersResponse>(
          '/api/offers'
        );

        const myOffers = offersResponse.data.filter(
          (offer) => offer.companyId === user.id
        );

        setOffers(myOffers);

        const applicationsResponse =
          await apiFetch<ApplicationsResponse>(
            '/api/applications/company'
          );

        setApplications(applicationsResponse.data);
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

    fetchData();
  }, [user]);

  async function handleStatusChange(
    applicationId: string,
    status: 'accepted' | 'rejected'
  ) {
    try {
      await apiFetch(
        `/api/applications/${applicationId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application
        )
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.';

      setError(message);
    }
  }

  return (
    <RouteGuard requiredRole="COMPANY">
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">
            Tableau de bord entreprise
          </h1>

          {loading && (
            <p className="text-center text-gray-600">
              Chargement...
            </p>
          )}

          {error && (
            <p className="mb-6 text-center text-red-600">
              Erreur : {error}
            </p>
          )}

          {!loading && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Mes offres
                  </h2>

                  <Link
                    href="/dashboard/company/offers/new"
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Nouvelle offre
                  </Link>
                </div>

                {offers.length === 0 ? (
                  <p className="text-gray-500">
                    Aucune offre pour le moment.
                  </p>
                ) : (
                  offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="mb-3 rounded-lg border bg-white p-4 shadow-sm"
                    >
                      <h3 className="font-semibold">
                        {offer.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {offer.description}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {offer.location || 'Lieu non précisé'} •{' '}
                        {offer.duration || 'Durée non précisée'}
                      </p>
                    </div>
                  ))
                )}
              </section>

              <section>
                <h2 className="mb-4 text-xl font-semibold">
                  Candidatures reçues
                </h2>

                {applications.length === 0 ? (
                  <p className="text-gray-500">
                    Aucune candidature reçue.
                  </p>
                ) : (
                  applications.map((application) => (
                    <div
                      key={application.id}
                      className="mb-3 rounded-lg border bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">
                            {application.student?.profile?.fullName ||
                              'Étudiant anonyme'}
                          </p>

                          <p className="text-sm text-gray-600">
                            Pour :{' '}
                            {application.offer?.title ||
                              'Offre supprimée'}
                          </p>

                          <p className="text-xs text-gray-400">
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString('fr-FR')}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
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
                        <p className="mb-3 text-sm">
                          {application.message}
                        </p>
                      )}

                      {application.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                application.id,
                                'accepted'
                              )
                            }
                            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                          >
                            Accepter
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                application.id,
                                'rejected'
                              )
                            }
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </section>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}