const raw = import.meta.env.VITE_API_URL || "";

export const API_BASE_URL = String(raw).replace(/\/$/, "");

export function resolveApiUrl(path: string) {
  if (!path) {
    return path;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  if (!path.startsWith("/")) {
    return path;
  }

  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}
