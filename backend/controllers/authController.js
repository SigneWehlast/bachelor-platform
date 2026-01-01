import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as AuthModel from '../models/authModel.js';

dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await AuthModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ error: 'Database error' });
  }
}