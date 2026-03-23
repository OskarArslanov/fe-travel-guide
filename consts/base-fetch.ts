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

  try {
    const response = await fetch(resultUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(url, data);
      return new FetchError(response.status, data);
    }

    return data;
  } catch (error: unknown) {
    console.error(`Fetch error for ${resultUrl}:`, error);
    throw new FetchError(0, { message: "Network error or invalid JSON" });
  }
};

export const isFetchError = (error: unknown): error is FetchError => {
  return error instanceof FetchError;
};
