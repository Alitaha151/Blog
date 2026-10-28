import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import postsRoutes from './routes/posts.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'tiny' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/posts', postsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
