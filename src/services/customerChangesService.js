const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchCustomerChanges() {
  try {
    const res = await fetch(`${BASE_URL}/api/customer/changes`);
    const data = await res.json();

    return data.map(c => {
      //checking if the customers is created within the last 24 hours
      const created = new Date(c.create_date);
      const now = new Date();
      const hoursDiff = (now - created) / (1000 * 60 * 60);

      return {
        id: c.customer_id,
        name: c.customer_name,
        date: created.toLocaleString('da-DK', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        isRecent: hoursDiff < 24
      };
    });

  } catch (err) {
    console.error('Error while fetching customers:', err);
    return [];
  }
}
