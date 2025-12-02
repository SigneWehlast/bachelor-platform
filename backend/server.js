import express from "express";
import mysql from "mysql2/promise";
import { platformDb } from "./config/dbConfig.js";
import cors from "cors"; 
import './cron.js';
import jwt from "jsonwebtoken";

const server = express();
server.use(express.json());

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

// Login
server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(400).send("User not found");

    if (password !== rows[0].password) return res.status(400).send("Wrong password");

    const token = jwt.sign({ user_id: rows[0].user_id }, "secretKey", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Database error");
  }
});

//customer-group
server.get("/api/customers-in-groups", async (req, res) => {
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
