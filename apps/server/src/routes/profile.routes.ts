import { Router, IRouter } from 'express';
import express from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  changeEmail,
  changeLanguage,
  changePassword,
  changeUsername,
  deleteAccount,
  getMyProfile,
  getPublicProfileHandler,
  uploadPicture,
} from '../controllers/profile.controller';

const router: IRouter = Router();

// All profile routes require authentication.
router.use(requireAuth);

router.get('/me', getMyProfile);
router.get('/public', getPublicProfileHandler);
router.patch('/username', changeUsername);
router.patch('/email', changeEmail);
router.patch('/password', changePassword);
router.patch('/language', changeLanguage);
router.delete('/me', deleteAccount);

// Picture upload carries a base64 image, so it needs a larger JSON body limit
// than the global parser (decoded buffer is capped at 5 MB in the service).
router.put('/picture', express.json({ limit: '8mb' }), uploadPicture);

export default router;
