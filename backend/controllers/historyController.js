import * as HistoryModel from "../models/historyModel.js";

// /api/history/carboost
export async function getCarboostHistory(req, res) {
  try {
    const rows = await HistoryModel.getCarboostHistory();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// /api/history/sales
export async function getSaleHistory(req, res) {
  try {
    const rows = await HistoryModel.getSalesHistory();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// /api/history/carboost/table
export async function getCarboostDailyTable(req, res) {
  try {
    const rows = await HistoryModel.getCarboostDailyTable();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// /api/history/months
export async function getMonths(req, res) {
  try {
    const rows = await HistoryModel.getMonths();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
