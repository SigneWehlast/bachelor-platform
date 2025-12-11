export async function getCustomersInGroups() {
  try {
    const res = await fetch(`http://localhost:3000/api/customer/customers-in-groups`);
    const data = await res.json();

    return data.map(item => ({
      groupName: item.group_name,
      customerCount: item.customer_count
    }));
  } catch (err) {
    console.error("Fejl ved hentning af kunder:", err);
    return [];
  }
}
