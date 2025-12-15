import { sortByName } from "@/utils/sort";
const BASE_URL = import.meta.env.VITE_BASE_URL 

//Hent rå data fra API
export async function fetchCustomersRaw() {
  try {
    const res = await fetch(`${BASE_URL}/api/customer`);
    return await res.json();
  } catch (err) {
    console.error("Fejl ved hentning af kunder:", err);
    return [];
  }
}

// Filtrer kunder uden navn
export function filterValidCustomers(customers) {
  return customers.filter(c => c.customer_name);
}

//Transformér til ønsket format
export function mapCustomers(customers) {
  return customers.map(c => ({ id: c.customer_id, name: c.customer_name, numberOfCars: c.number_of_cars }));
}

//Sortér kunder
export function sortCustomers(customers) {
  sortByName(customers);
  return customers;
}

//Kombiner alt til en “færdig” liste
export async function getCustomers() {
  const raw = await fetchCustomersRaw();
  const filtered = filterValidCustomers(raw);
  const mapped = mapCustomers(filtered);
  return sortCustomers(mapped);
}


// Hent kun valgte kunder til tabellen
//Tjek om der er ids
export function validateIds(idsArray) {
  return Array.isArray(idsArray) && idsArray.length > 0;
}

//Lav query string
export function buildIdsQuery(idsArray) {
  return idsArray.join(',');
}

//Hent rå data fra API
export async function fetchSelectedCustomers(idsArray) {
  if (!validateIds(idsArray)) return [];

  const ids = buildIdsQuery(idsArray);
  try {
    const res = await fetch(`${BASE_URL}api/customer/sale?ids=${ids}`);

    if (!res.ok) {
      const text = await res.text();
      console.error("Server returnerede ikke JSON:", text);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Fejl ved hentning af valgte kunder:", err);
    return [];
  }
}

//Mapper data til ønsket format
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

//Endelig funktion
export async function getSelectedCustomers(idsArray) {
  const rawData = await fetchSelectedCustomers(idsArray);
  return mapSelectedCustomers(rawData);
}