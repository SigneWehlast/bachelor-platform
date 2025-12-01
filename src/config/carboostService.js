import { sortByName } from "@/utils/sort";

export async function getCustomersInCarboost(page = 1, limit = 10) {
  try {
    console.log("Frontend: fetching page", page, "limit", limit);
    const res = await fetch(`http://localhost:3000/api/customer/carboost?page=${page}&limit=${limit}`);
    const result = await res.json();
    const data = result.data;
    const totalCount = result.totalCount;

    const customers = data
      .filter(c => c.customer_name)
      .map(c => ({
        id: c.customer_id,
        name: c.customer_name,
        leads: c.leads,
        last_updated: c.last_updated
      }));

    sortByName(customers);
    return {customers, totalCount};

  } catch (err) {
    console.error("Fejl ved hentning af kunder:", err);
    return [];
  }
}
