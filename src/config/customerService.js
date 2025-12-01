import { sortByName } from "@/utils/sort";

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
