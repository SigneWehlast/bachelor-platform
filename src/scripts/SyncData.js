import mysql from 'mysql2/promise';

// Source database configuration
const sourceDb = {
  host: 'nextgen.carads.io',
  port: 3306,
  user: 'student',
  password: 'uy4450Iy!d4S72#j3a',
  database: 'carads_platform'
};

// Target database configuration (update with your own database)
const targetDb = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'Platform'
};

async function syncData() {
  let sourceConn, targetConn;

  try {
    // Connect to both databases
    console.log('Connecting to databases...');
    sourceConn = await mysql.createConnection(sourceDb);
    targetConn = await mysql.createConnection(targetDb);
    console.log('Connected successfully\n');

    // Sync Budget
    console.log('Syncing budget data...');
    await targetConn.query('TRUNCATE TABLE budget');
    const [budgetRows] = await sourceConn.query(
      'SELECT `companies_id`, `amount`, `created_month`, `created_year` FROM `student_budget` WHERE 1'
    );
    console.log(`Found ${budgetRows.length} budget records`);
    
    if (budgetRows.length > 0) {
      const values = budgetRows.map(row => 
        [row.companies_id, row.amount, row.created_month, row.created_year]
      );
      await targetConn.query(
        'INSERT INTO budget (companies_id, amount, created_month, created_year) VALUES ?',
        [values]
      );
    }
    console.log('Budget sync completed\n');

    // Sync Dealers
    console.log('Syncing dealers data...');
    await targetConn.query('TRUNCATE TABLE dealers');
    const [dealerRows] = await sourceConn.query(
      'SELECT `id`, `name`, `latitude`, `longitude`, `domain` FROM `student_dealers` WHERE 1'
    );
    console.log(`Found ${dealerRows.length} dealer records`);
    
    if (dealerRows.length > 0) {
      const values = dealerRows.map(row => 
        [row.id, row.name, row.latitude, row.longitude, row.domain]
      );
      await targetConn.query(
        'INSERT INTO dealers (id, name, latitude, longitude, domain) VALUES ?',
        [values]
      );
    }
    console.log('Dealers sync completed\n');

    // Sync Leads
    console.log('Syncing leads data...');
    await targetConn.query('TRUNCATE TABLE leads');
    const [leadRows] = await sourceConn.query(
      'SELECT `companies_id`, `created_year`, `created_month`, `phone_lead`, `mail_lead`, `hard_lead` FROM `student_leads` WHERE 1'
    );
    console.log(`Found ${leadRows.length} lead records`);
    
    if (leadRows.length > 0) {
      const values = leadRows.map(row => 
        [row.companies_id, row.created_year, row.created_month, row.phone_lead, row.mail_lead, row.hard_lead]
      );
      await targetConn.query(
        'INSERT INTO leads (companies_id, created_year, created_month, phone_lead, mail_lead, hard_lead) VALUES ?',
        [values]
      );
    }
    console.log('Leads sync completed\n');

    // Sync Products
    console.log('Syncing product count data...');
    await targetConn.query('TRUNCATE TABLE product_count');
    const [productRows] = await sourceConn.query(
      'SELECT `companies_id`, `day`, `products` FROM `student_product_count` WHERE 1'
    );
    console.log(`Found ${productRows.length} product count records`);
    
    if (productRows.length > 0) {
      const values = productRows.map(row => 
        [row.companies_id, row.day, row.products]
      );
      await targetConn.query(
        'INSERT INTO product_count (companies_id, day, products) VALUES ?',
        [values]
      );
    }
    console.log('Product count sync completed\n');

    console.log('All data synced successfully!');

  } catch (err) {
    console.error('Error during sync:', err);
    throw err;
  } finally {
    // Close connections
    if (sourceConn) await sourceConn.end();
    if (targetConn) await targetConn.end();
    console.log('\nDatabase connections closed');
  }
}

// Run the sync
syncData()
  .then(() => {
    console.log('Sync completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  });