const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getCustomersInGroups() {
  try {
    const res = await fetch(`${BASE_URL}/api/customer/customers-in-groups`);
    const data = await res.json();

    return data.map(item => ({
      groupName: item.group_name,
      customerCount: item.customer_count
    }));
  } catch (err) {
    console.error('Fejl ved hentning af kunder:', err);
    return [];
  }
}
