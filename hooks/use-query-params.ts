"use client";

import { useSearchParams } from "next/navigation";

export const useQueryParams = () => {
  const searchParams = useSearchParams();

  const getQueryParams = () => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  };

  const setQueryParams = (params: Record<string, string | undefined>) => {
    const url = new URL(window.location.href);
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.replaceState({}, "", url.toString());
  };

  return { getQueryParams, setQueryParams };
};
