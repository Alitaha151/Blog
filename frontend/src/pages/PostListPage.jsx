import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchPosts } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import PostCard from '../components/PostCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';

const PAGE_SIZE = 5;

function readPage(searchParams) {
  const parsed = Number(searchParams.get('page'));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = readPage(searchParams);

  const { status, data, error, retry } = useApi(
    (signal) => fetchPosts({ page, limit: PAGE_SIZE, signal }),
    [page],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
  };

  return (
    <>
      <section className="hero">
        <p className="hero__eyebrow">The Dev Digest</p>
        <h1 className="hero__title">Notes from the front line of web development</h1>
        <p className="hero__subtitle">
          Practical articles about React, Node.js and everything in between — served straight from
          an Express REST API.
        </p>
      </section>

      {status === 'loading' ? <Spinner label={`Loading page ${page}…`} /> : null}

      {status === 'error' ? (
        <ErrorState title="Could not load the posts" message={error.message} onRetry={retry} />
      ) : null}

      {status === 'success' && data.data.length === 0 ? (
        <ErrorState title="No posts yet" message="The API returned an empty page." />
      ) : null}

      {status === 'success' && data.data.length > 0 ? (
        <>
          <p className="results" aria-live="polite">
            Showing{' '}
            <strong>
              {(data.pagination.page - 1) * data.pagination.limit + 1}–
              {(data.pagination.page - 1) * data.pagination.limit + data.data.length}
            </strong>{' '}
            of <strong>{data.pagination.total}</strong> posts
          </p>

          <div className="grid">
            {data.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination pagination={data.pagination} onChange={goToPage} />
        </>
      ) : null}
    </>
  );
}

export default PostListPage;
