import { Router, IRouter } from 'express';
import {
  // Google and GitHub OAuth are temporarily disabled — only 42 is wired up.
  // googleAuthorize,
  // googleCallback,
  // githubAuthorize,
  // githubCallback,
  fortytwoAuthorize,
  fortytwoCallback,
} from '../controllers/oauth.controller';

const router: IRouter = Router();

// router.get('/google', googleAuthorize);
// router.get('/google/callback', googleCallback);

// router.get('/github', githubAuthorize);
// router.get('/github/callback', githubCallback);

router.get('/42', fortytwoAuthorize);
router.get('/42/callback', fortytwoCallback);

export default router;
