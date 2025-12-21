import * as CustomerModel from "../models/customerModel.js";

// Hent alle kunder
export async function getAllCustomers(req, res) {
  try {
    const rows = await CustomerModel.getAllCustomers();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// Hent salgs-kunder
export async function getSaleCustomers(req, res) {
  try {
    const ids = req.query.ids.split(",").map(Number);
    const rows = await CustomerModel.getSaleCustomersByIds(ids);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// Hent Carboost liste
export async function getCarboostList(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await CustomerModel.getCarboostList(limit, offset);
    res.json({ data: result.rows, totalCount: result.totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// Hent kundernes ændringer
export async function getCustomerChanges(req, res) {
  try {
    const rows = await CustomerModel.getCustomerChanges();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// Hent kunder i grupper
export async function getCustomersInGroups(req, res) {
  try {
    const rows = await CustomerModel.getCustomersInGroups();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// Hent stats
export async function getCustomerStats(req, res) {
  try {
    const rows = await CustomerModel.getCustomerStats();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// Hent kunder efter måned
export async function getCustomersByDate(req, res) {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: "Missing month parameter" });

    const rows = await CustomerModel.getCustomersByDate(month);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

// Hent Carboost ændringer
export async function getCustomersCarboostChange(req, res) {
  try {
    const { month } = req.query;
    const rows = await CustomerModel.getCustomersCarboostChange(month);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}