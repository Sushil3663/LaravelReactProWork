const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${baseUrl}/storage/${path}`;
}
