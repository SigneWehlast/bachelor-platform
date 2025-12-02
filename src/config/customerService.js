import { sortByName } from "@/utils/sort";

// Hent alle kunder til valglisten
export async function getCustomers() {
  try {
    const res = await fetch("http://localhost:3000/api/customer");
    const data = await res.json();

    const customers = data
      .filter(c => c.customer_name)
      .map(c => ({ id: c.customer_id, name: c.customer_name }));

    sortByName(customers);

    return customers;

  } catch (err) {
    console.error("Fejl ved hentning af kunder:", err);
    return [];
  }
}

// Hent kun valgte kunder til tabellen
export async function getSelectedCustomers(idsArray) {
  try {
    if (!idsArray || idsArray.length === 0) return [];

    const ids = idsArray.join(',');

    const res = await fetch(`http://localhost:3000/api/customer/sale?ids=${ids}`);

    if (!res.ok) {
      const text = await res.text();
      console.error("Server returnerede ikke JSON:", text);
      return [];
    }

    const data = await res.json();

    const mappedData = data.map(c => ({
      id: c.customer_id,
      name: c.customer_name,
      numberOfCars: c.number_of_cars,
      totalBudget: c.total_budget,
      leads: c.leads,
      carboostConversions: c.carboost_conversions,
      budgetPerDay: Number((c.total_budget / (c.number_of_cars * 30)).toFixed(1)),
      conversionPercent: (c.leads/2)
    }));

    return mappedData;

  } catch (err) {
    console.error("Fejl ved hentning af valgte kunder:", err);
    return [];
  }
}
