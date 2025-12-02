import express from "express";
import mysql from "mysql2/promise";
import { platformDb } from "./config/dbConfig.js";
import cors from "cors"; 
import './cron.js';

const server = express();

const db = mysql.createPool(platformDb);

server.use(cors({
    origin: "http://localhost:5173"
  }));

//customers sale
server.get("/api/customer", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT customer_id, customer_name FROM customer");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//customer sale - show chosen customers
server.get('/api/customer/sale', async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const ids = req.query.ids.split(',').map(id => parseInt(id));
  const [rows] = await db.query(
  `SELECT customer_id, customer_name, number_of_cars, total_budget, leads, carboost_conversions
       FROM customer 
       WHERE customer_id IN (?) 
       ORDER BY customer_name ASC 
       LIMIT ? OFFSET ?`,
      [ids, limit, offset]
  );
  res.json(rows);
});

//customers carboost
server.get('/api/customer/carboost', async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query(
      "SELECT customer_id, customer_name, leads, last_updated FROM customer WHERE customer_name IS NOT NULL ORDER BY customer_name ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

     const [countRows] = await db.query(
      "SELECT COUNT(*) as totalCount FROM customer WHERE customer_name IS NOT NULL"
    );
    
    const totalCount = countRows[0].totalCount;

    res.json({ data: rows, totalCount });
  } catch (err) {
    res.status(500).json({ error: "Kunne ikke hente kunder" });
  }
});



//users
server.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//groups
server.get("/api/group", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM `group`");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//customer-group
server.get("/api/customergroup", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customer_group");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//history carboost
server.get("/api/history/carboost", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT customer_id, leads, last_updated FROM history");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//history sales
server.get("/api/history/sales", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT customer_id, carboost_conversions, total_budget, number_of_cars, leads FROM history");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

server.listen(3000, () => console.log("API running on port 3000"));
