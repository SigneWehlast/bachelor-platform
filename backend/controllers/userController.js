import { db } from "../app.js";

export async function getUserData(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT user_id, first_name, last_name 
      FROM users
    `);
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

export async function getUserRole(req, res) {
  try {
    const { user_id } = req.params;

    const [rows] = await db.query(`
      SELECT 
        r.role_id, r.role_name
      FROM user_role ur
      JOIN roles r ON ur.role_id = r.role_id
      WHERE ur.user_id = ?
    `, [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No role found for user" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
}