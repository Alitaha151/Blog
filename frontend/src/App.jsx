import { Link, Route, Routes } from 'react-router-dom';

import PostListPage from './pages/PostListPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" to="/">
            <span className="brand__mark">{"</>"}</span>
            The Dev Digest
          </Link>
          <nav className="site-nav" aria-label="Main">
            <Link to="/">Posts</Link>
            <a href="/api/posts" target="_blank" rel="noreferrer">
              API
            </a>
          </nav>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/:slug" element={<PostDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            Built with React + Vite on the front end and Node.js/Express on the back end. Data
            served from <code>GET /api/posts</code> and <code>GET /api/posts/:slug</code>.
          </p>
        </div>
      </footer>
    </div>
  );
}
