import { clsx, type ClassValue } from "clsx";

/**
 * Merges class names safely using clsx.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function prefixPath(src: string): string {
  if (!src) return src;

  // Jeśli to URL zewnętrzny, nie ruszaj
  if (
    src.startsWith("http") ||
    src.startsWith("https") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  const isProd = process.env.NODE_ENV === "production";
  const basePath = "/el-app";
  const cleanSrc = src.startsWith("/") ? src : `/${src}`;

  // Na GitHub Pages potrzebujemy dopisać basePath
  if (isProd) {
    return `${basePath}${cleanSrc}`;
  }

  return cleanSrc;
}
