import { syncData } from './SyncData.js';

syncData()
  .then(() => console.log('Sync completed!'))
  .catch(err => console.error('Sync failed:', err));