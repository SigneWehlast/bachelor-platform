import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';


import customerRoutes from './routes/customerRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { platformDb } from './config/dbConfig.js';

const app = express();
app.use(express.json());

export const db = mysql.createPool(platformDb);

app.use(cors({
  origin: 'http://localhost:5173'
}));

// Routes
app.use('/api/customer', customerRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);

export default app;
