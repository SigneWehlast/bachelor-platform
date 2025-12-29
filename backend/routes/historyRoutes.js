import express from 'express';
import {
  getCarboostHistory,
  getSaleHistory,
  getCarboostDailyTable,
  getMonths,
  debugSalesHistory
} from '../controllers/historyController.js';

const router = express.Router();

router.get('/carboost', getCarboostHistory);
router.get('/sales', getSaleHistory);
router.get('/carboost/table', getCarboostDailyTable);
router.get('/months', getMonths);
router.get('/debugSalesHistory', debugSalesHistory);
router.get('/ping', (req, res) => res.send('pong'));

export default router;