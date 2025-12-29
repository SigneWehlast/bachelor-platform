import { db } from '../app.js';

// Hent Carboost-historik
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

// Hent salgs-historik
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

// Hent daglig Carboost-tabel
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

// Hent alle måneder med historik
export async function getMonths() {
  const [rows] = await db.query(`
    SELECT DISTINCT DATE_FORMAT(archived_at, '%Y-%m') AS month
    FROM history
    ORDER BY month DESC
  `);
  return rows;
}

// Hent salgs-historik – safe version
export async function getSalesHistorySafe() {
  const [rows] = await db.query(`
    SELECT 
      h.customer_id,
      COALESCE(c.customer_name, 'Ukendt') AS customer_name,
      COALESCE(h.carboost_conversions, 0) AS carboost_conversions,
      COALESCE(h.total_budget, 0) AS total_budget,
      COALESCE(h.number_of_cars, 0) AS number_of_cars,
      COALESCE(h.leads, 0) AS leads,
      COALESCE(h.archived_at, NOW()) AS archived_at
    FROM history h
    LEFT JOIN customer c ON h.customer_id = c.customer_id
    ORDER BY h.archived_at DESC
  `);
  return rows;
}
