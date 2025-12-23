import { syncData } from '../scripts/SyncData.js';
import 'dotenv/config';

try {
  await syncData();
  console.log('Daglig sync/arkivering færdig ✓');
} catch (err) {
  console.error('Fejl under daglig sync:', err);
}
