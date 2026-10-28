/**
 * Small helper that carries an HTTP status code alongside the message so the
 * central error handler can build a consistent error payload.
 */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export function notFoundHandler(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity (4 args)
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;

  if (status >= 500) {
    console.error('[blog-api] unexpected error:', err);
  }

  res.status(status).json({
    error: {
      status,
      message: err.message || 'Internal Server Error',
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
