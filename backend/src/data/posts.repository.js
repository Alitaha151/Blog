import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DATA_FILE = fileURLToPath(new URL('./posts.json', import.meta.url));

/**
 * Static dataset loaded once at startup. Swapping this module for a database
 * client later only requires keeping the three exported functions below.
 */
const posts = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

// Newest first, which is what a blog index is expected to show.
const orderedPosts = [...posts].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
);

/** List view payload: everything except the (potentially long) body. */
export function toSummary(post) {
  const { content, ...summary } = post;
  return summary;
}

export function listPosts({ page, limit }) {
  const total = orderedPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    items: orderedPosts.slice(start, start + limit).map(toSummary),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export function findPostBySlug(slug) {
  return orderedPosts.find((post) => post.slug === slug);
}

export function getCategories() {
  return [...new Set(orderedPosts.map((post) => post.category))];
}
