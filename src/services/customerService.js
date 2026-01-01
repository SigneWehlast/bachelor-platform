import { sortByName } from '@/utils/sort';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchCustomersRaw() {
  try {
    const res = await fetch(`${BASE_URL}/api/customer`);
    return await res.json();
  } catch (err) {
    console.error('Fejl ved hentning af kunder:', err);
    return [];
  }
}

// Filter customers without a name
export function filterValidCustomers(customers) {
  return customers.filter(c => c.customer_name);
}

export function mapCustomers(customers) {
  return customers.map(c => ({ id: c.customer_id, name: c.customer_name, numberOfCars: c.number_of_cars }));
}

export function sortCustomers(customers) {
  sortByName(customers);
  return customers;
}

export async function getCustomers() {
  const raw = await fetchCustomersRaw();
  const filtered = filterValidCustomers(raw);
  const mapped = mapCustomers(filtered);
  return sortCustomers(mapped);
}

export function validateIds(idsArray) {
  return Array.isArray(idsArray) && idsArray.length > 0;
}

export function buildIdsQuery(idsArray) {
  return idsArray.join(',');
}

export async function fetchSelectedCustomers(idsArray) {
  if (!validateIds(idsArray)) return [];

  const ids = buildIdsQuery(idsArray);
  try {
    const res = await fetch(`${BASE_URL}/api/customer/sale?ids=${ids}`);

    if (!res.ok) {
      const text = await res.text();
      console.error('Server error JSON:', text);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Error while fetching chosen customers:', err);
    return [];
  }
}

export function mapSelectedCustomers(data) {
  return data.map(c => ({
    id: c.customer_id,
    name: c.customer_name,
    numberOfCars: c.number_of_cars,
    totalBudget: c.total_budget,
    leads: c.leads,
    carboostConversions: c.carboost_conversions,
    budgetPerDay: Number((c.total_budget / (c.number_of_cars * 30)).toFixed(1)),
    conversionPercent: c.leads > 0
      ? Number(((c.carboost_conversions / c.leads) * 100).toFixed(1))
      : 0
  }));
}

export async function getSelectedCustomers(idsArray) {
  const rawData = await fetchSelectedCustomers(idsArray);
  return mapSelectedCustomers(rawData);
}