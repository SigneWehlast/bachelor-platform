import { db } from "../app.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return res.status(400).send("User not found");
    if (password !== rows[0].password) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { user_id: rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch {
    res.status(500).send("Database error");
  }
}
