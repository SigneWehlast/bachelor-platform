import mysql from "mysql2/promise";
import { clientDb, platformDb } from "../config/dbConfig.js"; 

console.log("clientDb:", clientDb);
console.log("platformDb:", platformDb);

export async function syncData() {
  let clientConn, platformConn;

  try {
    console.log('Connecting to databases...');
    clientConn = await mysql.createConnection(clientDb);
    platformConn = await mysql.createConnection(platformDb);
    console.log('Connected successfully\n');

    await platformConn.query(`
        INSERT INTO history (
          customer_id, carboost_conversions, leads, dif_leads, total_budget, number_of_cars, archived_at
        )
        SELECT 
          c.customer_id,
          c.carboost_conversions,
          c.leads,
          c.leads - IFNULL((
            SELECT h.leads 
            FROM history h
            WHERE h.customer_id = c.customer_id
            ORDER BY h.archived_at DESC
            LIMIT 1
          ), 0) AS dif_leads,
          c.total_budget,
          c.number_of_cars,
          CONVERT_TZ(NOW(), 'UTC', 'Europe/Copenhagen')
        FROM customer c;
    `);

    console.log('Disabling foreign key checks...');
    await platformConn.query("SET FOREIGN_KEY_CHECKS = 0");

    console.log('Clearing customer table...');
    await platformConn.query("DELETE FROM customer");

    console.log('Enabling foreign key checks...');
    await platformConn.query("SET FOREIGN_KEY_CHECKS = 1");
//get data from student_budget
const [budgetRows] = await clientConn.query(`
  SELECT companies_id, amount, created_month, created_year
  FROM student_budget
`);

const budgetMapped = budgetRows.map(row => ({
  customer_id: row.companies_id,
  total_budget: row.amount,
  create_date: `${row.created_year}-${String(row.created_month).padStart(2, '0')}-01`
}));

//get name from student_dealers
const [dealerRows] = await clientConn.query(`
  SELECT id, name 
  FROM student_dealers
`);

const dealersMapped = dealerRows.map(row => ({
  customer_id: row.id,
  customer_name: row.name
}));

//get data from student_leads
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const [leadRows] = await clientConn.query(`
  SELECT companies_id, phone_lead, mail_lead, hard_lead
  FROM student_leads
  WHERE created_year = ? AND created_month = ?
`, [currentYear, currentMonth]);

const leadsMapped = leadRows.map(row => ({
  customer_id: row.companies_id,
  leads: (Number(row.phone_lead) || 0) + (Number(row.mail_lead) || 0) + (Number(row.hard_lead) || 0),
  carboost_conversions: Number(row.hard_lead) || 0
}));

//get data from student_product_count
const [productRows] = await clientConn.query(`
  SELECT companies_id, products
  FROM student_product_count
`);

const productsMapped = productRows.map(row => ({
  customer_id: row.companies_id,
  number_of_cars: row.products
}));

//merge data through mapping
const customerMap = {};

const merge = (rows) => {
  rows.forEach(r => {
    if (!customerMap[r.customer_id]) customerMap[r.customer_id] = {};
    Object.assign(customerMap[r.customer_id], r);
  });
};

merge(budgetMapped);
merge(dealersMapped);
merge(leadsMapped);
merge(productsMapped);

//insert into customer table
const insertRows = Object.values(customerMap);

if (insertRows.length > 0) {
  const values = insertRows.map(r => [
    r.customer_id || null,
    r.customer_name || null,
    r.total_budget || 0,
    r.create_date || null,
    r.leads || 0,
    r.number_of_cars || 0,
    r.carboost_conversions || 0,
    new Date()
  ]);

  await platformConn.query(`
    INSERT INTO customer 
    (customer_id, customer_name, total_budget, create_date, leads, number_of_cars, carboost_conversions, last_updated)
    VALUES ?
  `, [values]);
}

    console.log("Customer table synced ✓");

  } catch (err) {
    console.error("Error during sync:", err);
    throw err;

  } finally {
    if (clientConn) await clientConn.end();
    if (platformConn) await platformConn.end();
    console.log('Database connections closed');
  }
}