/**
 * Numbered pager. Renders the pages around the current one so the control does
 * not grow with the dataset, and hides itself when a single page exists.
 */
export function Pagination({ pagination, onChange }) {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = [];

  for (let number = start; number <= end; number += 1) pages.push(number);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="button"
        onClick={() => onChange(page - 1)}
        disabled={!hasPrevPage}
      >
        ← Prev
      </button>

      <ul className="pagination__pages">
        {start > 1 ? <li className="pagination__gap">…</li> : null}
        {pages.map((number) => (
          <li key={number}>
            <button
              type="button"
              className={`button button--page${number === page ? ' is-active' : ''}`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => onChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        {end < totalPages ? <li className="pagination__gap">…</li> : null}
      </ul>

      <button
        type="button"
        className="button"
        onClick={() => onChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next →
      </button>
    </nav>
  );
}

export default Pagination;
