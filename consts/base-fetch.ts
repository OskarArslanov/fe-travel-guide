type StandType = 'dev' | 'stage' | 'prod';

export const isCurrentHost = (stand: StandType) => {
  const env = process.env.NEXT_PUBLIC_API_URL;

  if (env?.includes('dev')) return stand === 'dev';
  if (env?.includes('stage')) return stand === 'stage';
  if (env?.includes('tasko.group')) return stand === 'prod';
  return false;
};

export type ErrorType = {
  code: number;
  message: string;
};

const catchError = async (response: Response) => {
  const json = await response.json();

  throw new Error(
    JSON.stringify({
      code: response.status,
      message: json.message,
    }),
  );
};

export const baseFetch = async (url: string, options?: RequestInit) => {
  const withOrigin = url.startsWith('http') ? url : process.env.NEXT_PUBLIC_API_URL + url;
  const revalidateTime = 1440;
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let response = await fetch(withOrigin, {
    ...options,
    headers: { ...defaultHeaders, ...options?.headers },
    next: {
      revalidate: revalidateTime,
      ...options?.next,
    },
  });

  if (!response.ok && typeof window !== 'undefined') {
    response = await catchError(response);
  }

  const data = await response.json();
  return data;
};
