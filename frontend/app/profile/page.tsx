'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import RouteGuard from '@/components/RouteGuard';
import apiFetch from '@/services/api';

interface ProfileResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    fullName: string | null;
    phone: string | null;
    avatarUrl: string | null;
    studentInfo: string | null;
    cvUrl: string | null;
    companyName: string | null;
    sector: string | null;
    description: string | null;
    website: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [studentInfo, setStudentInfo] = useState('');
  const [cvUrl, setCvUrl] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiFetch<ProfileResponse>(
          '/api/profile/me'
        );

        const profile = response.data;

        setFullName(profile.fullName || '');
        setPhone(profile.phone || '');
        setAvatarUrl(profile.avatarUrl || '');

        setStudentInfo(profile.studentInfo || '');
        setCvUrl(profile.cvUrl || '');

        setCompanyName(profile.companyName || '');
        setSector(profile.sector || '');
        setDescription(profile.description || '');
        setWebsite(profile.website || '');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger le profil.'
        );
      } finally {
        setLoadingProfile(false);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      fullName,
      phone,
      avatarUrl,
      studentInfo,
      cvUrl,
      companyName,
      sector,
      description,
      website,
    };

    try {
      await apiFetch('/api/profile/me', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setSuccess('Profil mis à jour avec succès.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de mettre à jour le profil.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">
            Mon profil
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg bg-white p-6 shadow"
          >
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-sm font-medium"
              >
                Nom complet *
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

            <div>
              <label
                htmlFor="avatarUrl"
                className="mb-1 block text-sm font-medium"
              >
                URL de l&apos;avatar
              </label>

              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            {user?.role === 'STUDENT' && (
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
                    onChange={(e) =>
                      setStudentInfo(e.target.value)
                    }
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
                  />
                </div>
              </>
            )}

            {user?.role === 'COMPANY' && (
              <>
                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nom de l&apos;entreprise *
                  </label>

                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                    required
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sector"
                    className="mb-1 block text-sm font-medium"
                  >
                    Secteur
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
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows={4}
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
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-green-600">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </main>
      </div>
    </RouteGuard>
  );
}
