const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchCustomerStats() {
    try {
      const res = await fetch(`${BASE_URL}/api/customer/stats`);
      if (!res.ok) throw new Error("Network error");
      return await res.json();
    } catch (err) {
      console.error("Error while getting customer stats", err);
      return [];
    }
  }
  
  export async function getCustomerStats() {
    const raw = await fetchCustomerStats();
    return raw.map(c => ({
      id: c.customer_id,
      name: c.customer_name,
      numberOfCars: c.number_of_cars,
      totalBudget: c.total_budget,
      leads: c.leads,
      carboostConversions: c.carboost_conversions
    }));
  }
  