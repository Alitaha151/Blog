import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { fetchPostBySlug } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import { formatDate } from '../utils/format.js';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';

export function PostDetailPage() {
  const { slug } = useParams();
  const [imageFailed, setImageFailed] = useState(false);

  const { status, data, error, retry } = useApi(
    (signal) => fetchPostBySlug(slug, { signal }),
    [slug],
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const post = data?.data;

  if (status === 'loading') {
    return <Spinner label="Loading post…" />;
  }

  if (status === 'error') {
    return error.status === 404 ? (
      <div className="state">
        <h1 className="state__title">Post not found</h1>
        <p className="state__message">
          We could not find an article with the slug <code>{slug}</code>.
        </p>
        <Link className="button button--primary" to="/">
          Back to all posts
        </Link>
      </div>
    ) : (
      <ErrorState title="Could not load this post" message={error.message} onRetry={retry} />
    );
  }

  return (
    <article className="post">
      <Link className="back-link" to="/">
        ← All posts
      </Link>

      <header className="post__header">
        <div className="card__meta">
          <span className="badge">{post.category}</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <h1 className="post__title">{post.title}</h1>
        <p className="post__excerpt">{post.excerpt}</p>

        <div className="post__author">
          <span className="avatar" aria-hidden="true">
            {post.author.avatarInitials}
          </span>
          <span>
            By <strong>{post.author.name}</strong>
          </span>
        </div>
      </header>

      {imageFailed ? null : (
        <img
          className="post__cover"
          src={post.coverImage}
          alt=""
          onError={() => setImageFailed(true)}
        />
      )}

      <div className="post__content">
        {post.content.split(/\n{2,}/).map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <footer className="post__tags">
        {post.tags.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
          </span>
        ))}
      </footer>
    </article>
  );
}

export default PostDetailPage;
