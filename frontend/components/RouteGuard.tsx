'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'STUDENT' | 'COMPANY';
}

export default function RouteGuard({
  children,
  requiredRole,
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/');
    }
  }, [loading, user, requiredRole, router]);

  if (
    loading ||
    !user ||
    (requiredRole && user.role !== requiredRole)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return <>{children}</>;
}
