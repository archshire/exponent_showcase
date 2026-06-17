import { Router, IRouter } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  accept,
  createRequest,
  decline,
  getFriends,
  getRequests,
  remove,
  search,
} from '../controllers/friends.controller';

const router: IRouter = Router();

router.use(requireAuth);

router.get('/', getFriends);
router.get('/search', search);
router.get('/requests', getRequests);
router.post('/requests', createRequest);
router.post('/requests/:requesterId/accept', accept);
router.post('/requests/:requesterId/decline', decline);
router.delete('/:otherId', remove);

export default router;
