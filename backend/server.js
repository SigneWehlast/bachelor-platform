import express from "express";
import mysql from "mysql2/promise";
import { platformDb } from "./config/dbConfig.js";
import cors from "cors"; 

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

//customers carboost
server.get("/api/customer", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT customer_id, leads, date FROM customer");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
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
server.get("/api/history", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT customer_id, leads, date FROM history");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//history sales
server.get("/api/history", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT customer_id, carboost_conversions, total_budget, number_of_cars, leads FROM history");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

server.listen(3000, () => console.log("API running on port 3000"));
