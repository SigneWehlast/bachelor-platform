import * as StatsModel from '../models/statsModel.js';

export async function getCustomerStats(req, res) {
  try {
    const rows = await StatsModel.getCustomerStats();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}