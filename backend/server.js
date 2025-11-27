import express from "express";
import mysql from "mysql2/promise";
import { targetDb } from "./config/dbConfig.js";


const server = express();

const db = mysql.createPool(targetDb);

server.get("/api/customers", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customer");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

server.listen(3000, () => console.log("API running on port 3000"));
