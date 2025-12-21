import { db } from "../app.js";

// Hent kundestatistik
export async function getCustomerStats() {
  const [rows] = await db.query(`
    SELECT customer_id, customer_name, number_of_cars, total_budget, leads, carboost_conversions
    FROM customer
  `);
  return rows;
}
