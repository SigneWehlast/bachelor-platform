import express from "express";
import {
  getCarboostHistory,
  getSalesHistory,
  getCarboostDailyTable
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/carboost", getCarboostHistory);
router.get("/sales", getSalesHistory);
router.get("/carboost/table", getCarboostDailyTable);

export default router;