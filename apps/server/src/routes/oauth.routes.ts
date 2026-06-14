import { Router, IRouter } from 'express';
import {
  googleAuthorize,
  googleCallback,
  githubAuthorize,
  githubCallback,
  fortytwoAuthorize,
  fortytwoCallback,
} from '../controllers/oauth.controller';

const router: IRouter = Router();

router.get('/google', googleAuthorize);
router.get('/google/callback', googleCallback);

router.get('/github', githubAuthorize);
router.get('/github/callback', githubCallback);

router.get('/42', fortytwoAuthorize);
router.get('/42/callback', fortytwoCallback);

export default router;
