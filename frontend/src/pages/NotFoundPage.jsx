import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="state">
      <h1 className="state__title">404</h1>
      <p className="state__message">That page does not exist.</p>
      <Link className="button button--primary" to="/">
        Back to all posts
      </Link>
    </div>
  );
}

export default NotFoundPage;
