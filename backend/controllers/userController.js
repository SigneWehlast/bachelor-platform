import * as UserModel from "../models/userModel.js";

// /api/users
export async function getUserData(req, res) {
  try {
    const rows = await UserModel.getUserData();
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

// /api/users/:user_id/role
export async function getUserRole(req, res) {
  try {
    const { user_id } = req.params;
    const role = await UserModel.getUserRole(user_id);

    if (!role) {
      return res.status(404).json({ message: "No role found for user" });
    }

    res.json(role);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
}