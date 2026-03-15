import { ReactNode } from "react";

export type IdValue = {
  id: string;
  value: ReactNode;
};

export type SizeType = "sm" | "md" | "lg";
export type StoreProps = {
  isLoading: boolean;
  error?: unknown;
};
