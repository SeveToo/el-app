// lib/utils.ts
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

  // Na GitHub Pages potrzebujemy dopisać basePath
  if (isProd) {
    // Zapobiegamy podwójnemu ukośnikowi
    const cleanSrc = src.startsWith("/") ? src : `/${src}`;

    return `${basePath}${cleanSrc}`;
  }

  return src;
}
