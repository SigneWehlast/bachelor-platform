import cron from 'node-cron';
import { syncData } from "../scripts/SyncData.js";

cron.schedule(
  '0 11 * * *',
  async () => {
    console.log('Starter daglig sync/arkivering kl. 12 (CET)...');
    try {
      await syncData();
      console.log('Daglig sync/arkivering færdig ✓');
    } catch (err) {
      console.error('Fejl under daglig sync:', err);
    }
  },
  { timezone: 'Europe/Copenhagen' }
);

console.log('Cron-job er aktivt og kører dagligt kl. 12.');
