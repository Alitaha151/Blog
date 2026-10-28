import { HttpError } from '../middleware/error.js';
import { listPosts, findPostBySlug } from '../data/posts.repository.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

/**
 * Parses a positive integer query param, falling back to `fallback` when the
 * value is absent. Throws a 400 instead of silently coercing bad input.
 */
function parsePositiveInt(rawValue, { name, fallback, max }) {
  if (rawValue === undefined || rawValue === '') return fallback;

  if (Array.isArray(rawValue)) {
    throw new HttpError(400, `Query parameter "${name}" must be provided once.`);
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value < 1) {
    throw new HttpError(400, `Query parameter "${name}" must be a positive integer.`, {
      received: rawValue,
    });
  }

  if (max && value > max) {
    throw new HttpError(400, `Query parameter "${name}" must be ${max} or less.`, {
      received: rawValue,
    });
  }

  return value;
}

/** GET /api/posts?page=1&limit=5 */
export function getPosts(req, res) {
  const page = parsePositiveInt(req.query.page, { name: 'page', fallback: DEFAULT_PAGE });
  const limit = parsePositiveInt(req.query.limit, {
    name: 'limit',
    fallback: DEFAULT_LIMIT,
    max: MAX_LIMIT,
  });

  const { items, pagination } = listPosts({ page, limit });

  if (page > pagination.totalPages) {
    throw new HttpError(404, `Page ${page} does not exist.`, {
      totalPages: pagination.totalPages,
    });
  }

  res.json({ data: items, pagination });
}

/** GET /api/posts/:slug */
export function getPostBySlug(req, res) {
  const slug = String(req.params.slug || '').trim().toLowerCase();
  const post = slug ? findPostBySlug(slug) : undefined;

  if (!post) {
    throw new HttpError(404, `No post found for slug "${req.params.slug}".`);
  }

  res.json({ data: post });
}
