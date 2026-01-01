import { db } from '../app.js';

// Get Carboost-history
export async function getCarboostHistory() {
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
  return rows;
}

// Get sales history
export async function getSalesHistory() {
  const [rows] = await db.query(`
    SELECT 
      h.customer_id,
      COALESCE(c.customer_name, 'Ukendt') AS customer_name,
      h.carboost_conversions,
      h.total_budget,
      h.number_of_cars,
      h.leads,
      COALESCE(h.archived_at, NOW()) AS archived_at
    FROM history h
    LEFT JOIN customer c ON h.customer_id = c.customer_id
  `);
  return rows;
}

//Get daily carboost table
export async function getCarboostDailyTable() {
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
  return rows;
}

//Gets the months that have data in the history table
export async function getMonths() {
  const [rows] = await db.query(`
    SELECT DISTINCT DATE_FORMAT(archived_at, '%Y-%m') AS month
    FROM history
    ORDER BY month DESC
  `);
  return rows;
}