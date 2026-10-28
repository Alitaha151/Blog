import { Router } from 'express';

import { getPosts, getPostBySlug } from '../controllers/posts.controller.js';

const router = Router();

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

export default router;
