import express from 'express';
import { getCurrentUser, getUserData, getUserRole } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/', getUserData);
router.get('/:user_id/role', getUserRole);
router.get('/me', authMiddleware, getCurrentUser);   


export default router;