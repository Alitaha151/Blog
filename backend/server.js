import app from './src/app.js';

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`[blog-api] listening on http://localhost:${PORT}`);
  console.log(`[blog-api] GET http://localhost:${PORT}/api/posts`);
  console.log(`[blog-api] GET http://localhost:${PORT}/api/posts/:slug`);
});

const shutdown = (signal) => {
  console.log(`\n[blog-api] ${signal} received, shutting down.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
