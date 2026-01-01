import { db } from '../app.js';

//Get all customers
export async function getAllCustomers() {
  const [rows] = await db.query(
    'SELECT customer_id, customer_name, number_of_cars FROM customer'
  );
  return rows;
}

//Get customers for sale by ID
export async function getSaleCustomersByIds(ids) {
  const [rows] = await db.query(`
    SELECT customer_id, customer_name, number_of_cars, total_budget, leads, carboost_conversions
    FROM customer
    WHERE customer_id IN (?)
    ORDER BY customer_name ASC
  `, [ids]);
  return rows;
}

//Get list for carboost (paginated)
export async function getCarboostList(limit, offset) {
  const [rows] = await db.query(`
    SELECT customer_id, customer_name, leads, last_updated
    FROM customer
    WHERE customer_name IS NOT NULL
    ORDER BY customer_name ASC
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  const [[{ totalCount }]] = await db.query(`
    SELECT COUNT(*) AS totalCount FROM customer
    WHERE customer_name IS NOT NULL
  `);

  return { rows, totalCount };
}

//Get customers for customerchanges
export async function getCustomerChanges() {
  const [rows] = await db.query(`
    SELECT customer_id, customer_name, create_date
    FROM customer
    ORDER BY create_date DESC
  `);
  return rows;
}

//Get the total of customers in each group
export async function getCustomersInGroups() {
  const [rows] = await db.query(`
    SELECT g.group_name, COUNT(cg.customer_id) AS customer_count
    FROM customer_group cg
    JOIN \`group\` g ON cg.group_id = g.group_id
    GROUP BY g.group_name
  `);
  return rows;
}

//Get customer stats
export async function getCustomerStats() {
  const [rows] = await db.query(`
    SELECT customer_id, customer_name, number_of_cars, total_budget, leads, carboost_conversions
    FROM customer
  `);
  return rows;
}

//Get customers based on month
export async function getCustomersByDate(month) {
  const [rows] = await db.query(`
    SELECT h.customer_id, c.customer_name, h.leads, h.dif_leads, h.archived_at
    FROM history h
    JOIN customer c ON h.customer_id = c.customer_id
    INNER JOIN (
        SELECT customer_id, MAX(archived_at) AS latest_date
        FROM history
        WHERE DATE_FORMAT(archived_at, '%Y-%m') = ?
        GROUP BY customer_id
    ) latest
    ON h.customer_id = latest.customer_id AND h.archived_at = latest.latest_date
    WHERE c.customer_name IS NOT NULL
    ORDER BY c.customer_name ASC;
  `, [month]);
  return rows;
}

//Get carboost changes from month to month
export async function getCustomersCarboostChange(month) {
  const [year, mon] = month.split('-').map(Number);
  const prevMonth = mon === 1 ? `${year-1}-12` : `${year}-${(mon-1).toString().padStart(2,'0')}`;
  const [rows] = await db.query(`
    SELECT 
      h.customer_id,
      c.customer_name,
      h.leads AS leads,
      IFNULL(prev.leads,0) AS prev_leads,
      h.archived_at
    FROM history h
    JOIN customer c ON h.customer_id = c.customer_id
    LEFT JOIN (
      SELECT h2.customer_id, h2.leads
      FROM history h2
      INNER JOIN (
        SELECT customer_id, MAX(archived_at) AS latest_date
        FROM history
        WHERE DATE_FORMAT(archived_at, '%Y-%m') = ?
        GROUP BY customer_id
      ) latest_prev
      ON h2.customer_id = latest_prev.customer_id AND h2.archived_at = latest_prev.latest_date
    ) prev
    ON h.customer_id = prev.customer_id
    INNER JOIN (
      SELECT customer_id, MAX(archived_at) AS latest_date
      FROM history
      WHERE DATE_FORMAT(archived_at, '%Y-%m') = ?
      GROUP BY customer_id
    ) latest
    ON h.customer_id = latest.customer_id AND h.archived_at = latest.latest_date
    ORDER BY c.customer_name ASC;
  `, [prevMonth, month]);
  return rows;
}
