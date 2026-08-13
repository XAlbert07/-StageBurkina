import Link from 'next/link';

export default function Navbar() {
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
            href="/offres"
            className="hover:text-blue-600"
          >
            Offres
          </Link>

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
        </div>
      </div>
    </nav>
  );
}
