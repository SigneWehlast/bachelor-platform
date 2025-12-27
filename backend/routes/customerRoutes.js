import express from 'express';
import {
  getAllCustomers,
  getSaleCustomers,
  getCarboostList,
  getCustomerChanges,
  getCustomersInGroups,
  getCustomerStats,
  getCustomersByDate,
  getCustomersCarboostChange
} from '../controllers/customerController.js';

const router = express.Router();

router.get('/', getAllCustomers);
router.get('/sale', getSaleCustomers);
router.get('/carboost', getCarboostList);
router.get('/changes', getCustomerChanges);
router.get('/customers-in-groups', getCustomersInGroups);
router.get('/stats', getCustomerStats);
router.get('/carboost/date', getCustomersByDate);
router.get('/carboost/change', getCustomersCarboostChange);

export default router;