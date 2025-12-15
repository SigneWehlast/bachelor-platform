import { db } from "../app.js";

export async function getUserData(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT first_name, last_name
      FROM users
    `);
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
}
