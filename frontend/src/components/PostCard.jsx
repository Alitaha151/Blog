import { useState } from 'react';
import { Link } from 'react-router-dom';

import { formatDate } from '../utils/format.js';

export function PostCard({ post }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="card">
      <Link className="card__media" to={`/posts/${post.slug}`} tabIndex={-1} aria-hidden="true">
        {imageFailed ? (
          <span className="card__media-fallback">{post.author.avatarInitials}</span>
        ) : (
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
      </Link>

      <div className="card__body">
        <div className="card__meta">
          <span className="badge">{post.category}</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <h2 className="card__title">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="card__excerpt">{post.excerpt}</p>

        <footer className="card__footer">
          <span className="avatar" aria-hidden="true">
            {post.author.avatarInitials}
          </span>
          <span>{post.author.name}</span>
        </footer>
      </div>
    </article>
  );
}

export default PostCard;
