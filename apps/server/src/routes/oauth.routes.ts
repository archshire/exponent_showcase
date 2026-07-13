import { Router, IRouter } from 'express';
import { fortytwoAuthorize, fortytwoCallback } from '../controllers/oauth.controller';

const router: IRouter = Router();

router.get('/42', fortytwoAuthorize);
router.get('/42/callback', fortytwoCallback);

export default router;
