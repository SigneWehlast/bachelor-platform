import { db } from "../app.js";

// /api/history/carboost
export async function getCarboostHistory(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        h.customer_id, 
        c.customer_name, 
        h.leads, 
        h.dif_leads, 
        h.archived_at
      FROM history h
      INNER JOIN customer c ON h.customer_id = c.customer_id
      ORDER BY h.archived_at DESC
    `);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
}

// /api/history/sales
export async function getSalesHistory(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        h.customer_id,
        c.customer_name,
        h.carboost_conversions,
        h.total_budget,
        h.number_of_cars,
        h.leads,
        h.archived_at
      FROM history h
      JOIN customer c ON h.customer_id = c.customer_id
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// /api/history/carboost/table
export async function getCarboostDailyTable(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        h.customer_id,
        h.dif_leads AS todays_dif, 
        prev.dif_leads AS yesterdays_dif,
        COALESCE(h.dif_leads - prev.dif_leads, 0) AS \`change\`,
        h.archived_at
      FROM history h
      LEFT JOIN history prev 
        ON h.customer_id = prev.customer_id
        AND DATE(prev.archived_at) = DATE_SUB(DATE(h.archived_at), INTERVAL 1 DAY)
      WHERE DATE(h.archived_at) = CURDATE()
    `);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
}

export async function getMonths(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT DATE_FORMAT(archived_at, '%Y-%m') AS month
      FROM history
      ORDER BY month DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};