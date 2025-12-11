import express from "express";
import {
  getCarboostHistory,
  getSalesHistory,
  getCarboostDailyTable,
  getMonths
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/carboost", getCarboostHistory);
router.get("/sales", getSalesHistory);
router.get("/carboost/table", getCarboostDailyTable);
router.get("/months", getMonths);

export default router;