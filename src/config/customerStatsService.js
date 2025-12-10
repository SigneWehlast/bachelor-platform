// customerStatsService.js
export async function fetchCustomerStats() {
    try {
      const res = await fetch("http://localhost:3000/api/customer/stats");
      if (!res.ok) throw new Error("Netværksfejl");
      return await res.json();
    } catch (err) {
      console.error("Fejl ved hentning af customer stats:", err);
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
  