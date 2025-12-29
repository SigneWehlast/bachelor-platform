import { db } from '../app.js';

// Hent alle brugere
export async function getUserData() {
  const [rows] = await db.query(`
    SELECT user_id, first_name, last_name 
    FROM users
  `);
  return rows;
}

// Hent brugerens rolle
export async function getUserRole(user_id) {
  const [rows] = await db.query(`
    SELECT 
      r.role_id, r.role_name
    FROM user_role ur
    JOIN roles r ON ur.role_id = r.role_id
    WHERE ur.user_id = ?
  `, [user_id]);

  return rows[0] || null;
}

export async function getUserDataById(user_id) {
  const [rows] = await db.query(`
    SELECT user_id, first_name, last_name 
    FROM users
    WHERE user_id = ?
  `, [user_id]);
  return rows;
}
