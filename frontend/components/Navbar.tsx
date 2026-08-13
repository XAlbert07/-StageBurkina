'use client';

import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const displayName = user
    ? user.role === 'COMPANY'
      ? user.profile?.companyName || user.email
      : user.profile?.fullName || user.email
    : '';

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600"
        >
          Stage Burkina
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hover:text-blue-600"
          >
            Offres
          </Link>

          {user ? (
            <>
              {user.role === 'COMPANY' ? (
                <Link
                  href="/dashboard/company"
                  className="hover:text-blue-600"
                >
                  Tableau de bord
                </Link>
              ) : (
                <Link
                  href="/dashboard/student"
                  className="hover:text-blue-600"
                >
                  Mes candidatures
                </Link>
              )}

             <Link
               href="/profile"
  className="hover:text-blue-600"
>
  Profil
</Link> 

              <span className="text-gray-600">
                {displayName}
              </span>

              <button
                type="button"
                onClick={logout}
                className="text-red-600 hover:underline"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-blue-600"
              >
                Connexion
              </Link>

              <Link
                href="/register"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
