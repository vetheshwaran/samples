import express from 'express';
import { getLeads } from '../controllers/leadController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getLeads);

export default router;
