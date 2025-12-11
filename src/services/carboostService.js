import { sortByName } from "@/utils/sort";
const BASE_URL = import.meta.env.VITE_BASE_URL 

export async function getCustomersInCarboost(page = 1, limit = 10) {
  try {
    const resCustomers = await fetch(`${BASE_URL}/api/customer/carboost?page=${page}&limit=${limit}`);
    const resultCustomers = await resCustomers.json();
    const customersData = resultCustomers.data;
    const totalCount = resultCustomers.totalCount;

    const resHistory = await fetch(`${BASE_URL}/api/history/carboost/table`);
    const historyData = await resHistory.json();

    const customers = customersData
      .filter(c => c.customer_name)
      .map(c => {
        const history = historyData.find(h => h.customer_id === c.customer_id) || {};
        const change = history.change || 0;
        const todays_dif = history.todays_dif || 0;
        const yesterdays_dif = history.yesterdays_dif || 0;

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
          last_updated: c.last_updated
        };

      });

    sortByName(customers);
    return { customers, totalCount };

  } catch (err) {
    console.error("Fejl ved hentning af kunder:", err);
    return { customers: [], totalCount: 0 };
  }
}

export const getCustomersInCarboostByDate = async (month) => {
  try {
    const res = await fetch(`http://localhost:3000/api/customer/carboost/date?month=${month}`);
    if (!res.ok) throw new Error("Server error");

    const data = await res.json(); 
    const rows = data || [];

    const customers = rows.map(r => ({
      id: r.customer_id,
      name: r.customer_name,
      leads: r.leads,
      change: r.dif_leads || 0,
      todays_dif: r.dif_leads || 0,
      yesterdays_dif: 0,
      last_updated: r.archived_at,
      tendens: r.dif_leads > 0 ? 'up' : r.dif_leads < 0 ? 'down' : '-'
    }));
    return { customers };
  } catch (err) {
    console.error("Fejl i getCustomersInCarboostByDate:", err);
    return { customers: [] };
  }
};
