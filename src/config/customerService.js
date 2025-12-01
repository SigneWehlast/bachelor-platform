export async function getCustomers() {
    try {
      const res = await fetch("http://localhost:3000/api/customers");
      const data = await res.json();
      
      return data
        .filter(c => c.customer_name)
        .map(c => ({ id: c.customer_id, name: c.customer_name }))
        .sort((a, b) => a.name.localeCompare(b.name));

      } catch (err) {
      console.error("Fejl ved hentning af kunder:", err);
      return [];
    }
  }