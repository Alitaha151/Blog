const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Thin wrapper around fetch that normalises the two failure modes the UI cares
 * about: the request never reached the server, or the server answered with an
 * error payload shaped like `{ error: { status, message } }`.
 */
export async function apiRequest(path, { signal } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(
      'Could not reach the blog API. Make sure the backend is running on http://localhost:5000.',
      0,
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message || `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  return payload;
}

export function fetchPosts({ page, limit, signal }) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiRequest(`/posts?${params}`, { signal });
}

export function fetchPostBySlug(slug, { signal } = {}) {
  return apiRequest(`/posts/${encodeURIComponent(slug)}`, { signal });
}
