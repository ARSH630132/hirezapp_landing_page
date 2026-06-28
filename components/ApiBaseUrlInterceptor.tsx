"use client";

export function ApiBaseUrlInterceptor() {
  // Private admin and portal pages depend on the Next.js /api/v1 routes.
  // Rewriting those requests to the FastAPI service causes 401/404 errors
  // because the backend does not expose the same route surface.
  return null;
}
