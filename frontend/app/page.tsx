'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Navbar from '@/components/Navbar';
import apiFetch from '@/services/api';

type Profile = {
  companyName?: string | null;
};

type Company = {
  profile?: Profile | null;
};

type Offer = {
  id: string;
  title: string;
  description: string;
  requirements?: string | null;
  duration?: string | null;
  location?: string | null;
  company?: Company | null;
};

type OffersResponse = {
  success: boolean;
  data: Offer[];
};

export default function HomePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const data = await apiFetch<OffersResponse>('/api/offers');
        setOffers(data.data);
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

    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Stages disponibles au Burkina Faso
        </h1>

        {loading && (
          <p className="text-center text-gray-600">
            Chargement des offres...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600">
            Erreur : {error}
          </p>
        )}

        {!loading && !error && offers.length === 0 && (
          <p className="text-center text-gray-500">
            Aucune offre pour le moment.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h2 className="mb-2 text-xl font-semibold">
                {offer.title}
              </h2>

              <p className="mb-3 line-clamp-3 text-gray-600">
                {offer.description}
              </p>

              <div className="space-y-1 text-sm text-gray-500">
                {offer.company?.profile?.companyName && (
                  <p>
                    Entreprise :{' '}
                    {offer.company.profile.companyName}
                  </p>
                )}

                {offer.location && (
                  <p>Lieu : {offer.location}</p>
                )}

                {offer.duration && (
                  <p>Durée : {offer.duration}</p>
                )}
              </div>

              <Link
                href={`/offres/${offer.id}`}
                className="mt-4 inline-block font-medium text-blue-600 hover:text-blue-800"
              >
                Voir l'offre
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
