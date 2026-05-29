import express from 'express';
import { getAllUsers, verifyUser } from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.post('/verify', authenticateToken, isAdmin, verifyUser);

export default router;
