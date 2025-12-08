import { sortByName } from "@/utils/sort";

export async function getCustomersInCarboost(page = 1, limit = 10) {
  try {
    const resCustomers = await fetch(`http://localhost:3000/api/customer/carboost?page=${page}&limit=${limit}`);
    const resultCustomers = await resCustomers.json();
    const customersData = resultCustomers.data;
    const totalCount = resultCustomers.totalCount;

    const resHistory = await fetch(`http://localhost:3000/api/history/carboost/table`);
    const historyData = await resHistory.json();

    const customers = customersData
      .filter(c => c.customer_name)
      .map(c => {
        const customerHistory = historyData.filter(h => h.customer_id === c.customer_id);
        const latestHistory = customerHistory[customerHistory.length - 1] || {};
        
        const change = latestHistory.change || 0;
        const todays_dif = latestHistory.todays_dif || 0;
        const yesterdays_dif = latestHistory.yesterdays_dif || 0;


        let tendens = '-';
        if (change > 0) tendens = 'up';
        else if (change < 0) tendens = 'down';

        return {
          id: c.customer_id,
          name: c.customer_name,
          leads: todays_dif,
          change: change,
          tendens: tendens,
          todays_dif: todays_dif,
          yesterdays_dif: yesterdays_dif,
          last_updated: c.last_updated,
          history: customerHistory,
        };

      });

    sortByName(customers);
    return { customers, totalCount };

  } catch (err) {
    console.error("Fejl ved hentning af kunder:", err);
    return { customers: [], totalCount: 0 };
  }
}
