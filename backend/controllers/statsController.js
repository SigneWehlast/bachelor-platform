import { db } from "../app.js";

export async function getCustomerStats(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT customer_id, customer_name, number_of_cars, total_budget, leads, carboost_conversions
      FROM customer
    `);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
}