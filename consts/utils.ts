import classNames from "classnames";

export const cn = classNames;

export const buildParams = (
  params?: Record<string, unknown>,
  type: "browser" | "fetch" = "browser",
) => {
  if (!params) return "";

  const paramPairs: string[] = [];

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value) && type === "fetch") {
        // Для массивов создаем множественные параметры
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== "") {
            paramPairs.push(`${key}=${encodeURIComponent(String(item))}`);
          }
        });
      } else {
        // Для обычных значений
        paramPairs.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    }
  });

  if (paramPairs.length === 0) return "";
  return "?" + paramPairs.join("&");
};

export const parseParams = (url: string) => {
  const result: Record<string, string> = {};
  const searchParams = new URL(url).searchParams;
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

export function getFlagEmoji(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
