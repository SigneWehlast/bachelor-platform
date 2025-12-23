import express from 'express';
import { getCustomerStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/customer', getCustomerStats);

export default router;