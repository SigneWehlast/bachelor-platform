import * as HistoryModel from '../models/historyModel.js';

//Get data for carboost from history table
// /api/history/carboost
export async function getCarboostHistory(req, res) {
  try {
    const rows = await HistoryModel.getCarboostHistory();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

//Get data for sale from history table
// /api/history/sales
export async function getSaleHistory(req, res) {
  try {
    const rows = await HistoryModel.getSalesHistory();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

//Gets data for carboost for today and yesterday to get change
// /api/history/carboost/table
export async function getCarboostDailyTable(req, res) {
  try {
    const rows = await HistoryModel.getCarboostDailyTable();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Gets the months that have data in the history table
// /api/history/months
export async function getMonths(req, res) {
  try {
    const rows = await HistoryModel.getMonths();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}