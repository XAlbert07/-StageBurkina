// types/index.ts

export interface User {
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
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  requirements?: string | null;
  duration?: string | null;
  location?: string | null;
  isActive: boolean;
  companyId: string;

  company?: {
    profile?: {
      companyName?: string | null;
    } | null;
  } | null;

  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  offerId: string;
  studentId: string;
  message?: string | null;
  cvUrl?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  offer?: Offer;
  student?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
