import cron from 'node-cron';
import { syncData } from "../scripts/SyncData.js";

cron.schedule(
  '* 12 * * *',
  async () => {
    console.log('Starter daglig sync/arkivering kl. 19:15 (CET)...');
    try {
      await syncData();
      console.log('Daglig sync/arkivering færdig ✓');
    } catch (err) {
      console.error('Fejl under daglig sync:', err);
    }
  },
  { timezone: 'Europe/Copenhagen' }
);

console.log('Cron-job er aktivt og kører dagligt kl. 19:15.');