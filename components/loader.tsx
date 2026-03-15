import { SizeType } from "@/consts/props";
import { cn } from "@/consts/utils";
import { FC } from "react";

interface Props {
  size?: SizeType;
}

const sizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
};

export const Loader: FC<Props> = ({ size = "md" }) => {
  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
};
