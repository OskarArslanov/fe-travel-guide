export class FetchError extends Error {
  constructor(
    public status: number,
    public data: { message: string },
  ) {
    super(data.message);
    this.name = "FetchError";
  }
}

export const baseFetch = async (url: string, options?: RequestInit) => {
  const resultUrl = url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  const response = await fetch(resultUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(response);
    return new FetchError(response.status, data);
  }

  return data;
};

export const isFetchError = (error: unknown): error is FetchError => {
  return error instanceof FetchError;
};
