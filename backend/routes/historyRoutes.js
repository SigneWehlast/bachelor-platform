import express from 'express';
import {
  getCarboostHistory,
  getSaleHistory,
  getCarboostDailyTable,
  getMonths
} from '../controllers/historyController.js';

const router = express.Router();

router.get('/carboost', getCarboostHistory);
router.get('/sales', getSaleHistory);
router.get('/carboost/table', getCarboostDailyTable);
router.get('/months', getMonths);

export default router;