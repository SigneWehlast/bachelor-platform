import { db } from "../app.js";

export async function getAllCustomers(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT customer_id, customer_name, number_of_cars FROM customer"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err.code, err.sqlMessage, err.sql);
    res.status(500).json({ error: err.message });
  }
}

export async function getSaleCustomers(req, res) {
  const ids = req.query.ids.split(",").map(Number);

  try {
    const [rows] = await db.query(`
      SELECT customer_id, customer_name, number_of_cars, total_budget, leads, carboost_conversions
      FROM customer
      WHERE customer_id IN (?)
      ORDER BY customer_name ASC
    `, [ids]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
}

export async function getCarboostList(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query(`
      SELECT customer_id, customer_name, leads, last_updated
      FROM customer
      WHERE customer_name IS NOT NULL
      ORDER BY customer_name ASC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [countRows] = await db.query(`
      SELECT COUNT(*) AS totalCount FROM customer 
      WHERE customer_name IS NOT NULL
    `);

    res.json({ data: rows, totalCount: countRows[0].totalCount });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
}

export async function getCustomerChanges(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT customer_id, customer_name, create_date
      FROM customer
      ORDER BY create_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
}

export async function getCustomersInGroups(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT g.group_name, COUNT(cg.customer_id) AS customer_count
      FROM customer_group cg
      JOIN \`group\` g ON cg.group_id = g.group_id
      GROUP BY g.group_name
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function getCustomerStats(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT customer_id, customer_name, number_of_cars, total_budget, leads, carboost_conversions
      FROM customer
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function getCustomersByDate(req, res) {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Missing month parameter" });
    }

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

    res.json(rows);
  } catch (err) {
    console.error("Fejl i /customer/carboost/date:", err);
    res.status(500).json({ error: "Server error" });
  }
}


export async function getCustomersCarboostChange(req, res) {
  try {
    const { month } = req.query;
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

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
