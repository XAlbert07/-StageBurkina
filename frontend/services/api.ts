const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type ApiOptions = RequestInit & {
  headers?: HeadersInit;
};

async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Une erreur est survenue.'
    );
  }

  return data as T;
}

export default apiFetch;
