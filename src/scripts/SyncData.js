import mysql from 'mysql2/promise';

const sourceDb = {
  host: 'nextgen.carads.io',
  port: 3306,
  user: 'student',
  password: 'uy4450Iy!d4S72#j3a',
  database: 'carads_platform'
};

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
    console.log('Connecting to databases...');
    sourceConn = await mysql.createConnection(sourceDb);
    targetConn = await mysql.createConnection(targetDb);
    console.log('Connected successfully\n');


    //delete customer table to overwrite
    console.log('Disabling foreign key checks...');
    await targetConn.query("SET FOREIGN_KEY_CHECKS = 0");
    
    console.log('Clearing customer table...');
    await targetConn.query("DELETE FROM customer");
    
    console.log('Enabling foreign key checks...');
    await targetConn.query("SET FOREIGN_KEY_CHECKS = 1");

    //get data from student_budget
    const [budgetRows] = await sourceConn.query(`
      SELECT companies_id, amount, created_month, created_year
      FROM student_budget
    `);

    const budgetMapped = budgetRows.map(row => ({
      customer_id: row.companies_id,
      total_budget: row.amount,
      create_date: `${row.created_year}-${String(row.created_month).padStart(2, '0')}-01`
    }));

    //get name from student_dealers
    const [dealerRows] = await sourceConn.query(`
      SELECT id, name 
      FROM student_dealers
    `);

    const dealersMapped = dealerRows.map(row => ({
      customer_id: row.id,
      customer_name: row.name
    }));

    //get data from student_leads
    const [leadRows] = await sourceConn.query(`
      SELECT companies_id, phone_lead, mail_lead, hard_lead
      FROM student_leads
    `);

    const leadsMapped = leadRows.map(row => ({
      customer_id: row.companies_id,
      leads: (row.phone_lead || 0) + (row.mail_lead || 0) + (row.hard_lead || 0),
      carboost_conversions: row.hard_lead || 0
    }));

    //get data from student_product_count
    const [productRows] = await sourceConn.query(`
      SELECT companies_id, products
      FROM student_product_count
    `);

    const productsMapped = productRows.map(row => ({
      customer_id: row.companies_id,
      number_of_cars: row.products
    }));

    //merge data through mapping
    const customerMap = {};

    const merge = (rows) => {
      rows.forEach(r => {
        const id = r.customer_id;
        if (!customerMap[id]) customerMap[id] = {};
        Object.assign(customerMap[id], r);
      });
    };

    merge(budgetMapped);
    merge(dealersMapped);
    merge(leadsMapped);
    merge(productsMapped);

    //insert into customer table
    const insertRows = Object.values(customerMap);

    if (insertRows.length > 0) {
      const values = insertRows.map(r => [
        r.customer_id || null,
        r.customer_name || null,
        r.total_budget || 0,
        r.create_date || null,
        r.leads || 0,
        r.number_of_cars || 0,
        r.carboost_conversions || 0
      ]);

      await targetConn.query(`
        INSERT INTO customer 
        (customer_id, customer_name, total_budget, create_date, leads, number_of_cars, carboost_conversions)
        VALUES ?
      `, [values]);
    }

    console.log("Customer table synced ✓");

  } catch (err) {
    console.error("Error during sync:", err);
    throw err;
  } finally {
    if (sourceConn) await sourceConn.end();
    if (targetConn) await targetConn.end();
    console.log('Database connections closed');
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
