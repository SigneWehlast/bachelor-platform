import express from "express";
import {
  getAllCustomers,
  getSaleCustomers,
  getCarboostList,
  getCustomerChanges
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/sale", getSaleCustomers);
router.get("/carboost", getCarboostList);
router.get("/changes", getCustomerChanges);

export default router;