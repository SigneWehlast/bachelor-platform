import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as AuthModel from '../models/authModel.js';

dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await AuthModel.findUserByEmail(email);

    if (!user) return res.status(400).send('User not found');
    if (password !== user.password) return res.status(400).send('Wrong password');

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
}