const BASE_URL = import.meta.env.VITE_BASE_URL 

export async function getHistoryCarboost() {
  try {
    const res = await fetch(`${BASE_URL}/api/history/carboost`);
    const result = await res.json();
    const data = Array.isArray(result) ? result : [];
    const grouped = {};

    data.forEach(item => {
      const id = item.customer_id;
      const date = new Date(item.archived_at).toLocaleDateString("da-DK");

      const key = `${id}-${date}`;

      if (!grouped[key]) {
        grouped[key] = {
          id,
          name: item.customer_name,
          dif_leads: 0,
          archived_at: item.archived_at
        };
      }
      grouped[key].dif_leads += item.dif_leads;
    });

    const history = Object.values(grouped);

    return { history, totalCount: history.length };

  } catch (err) {
    console.error("Fejl ved hentning af historik:", err);
    return { history: [], totalCount: 0 };
  }
}


export async function getHistorySales() {
  try {
    const res = await fetch(`${BASE_URL}/api/history/sales`);
    const result = await res.json();

    const data = Array.isArray(result) ? result : [];

    const grouped = {};

    data.forEach(item => {
      const id = item.customer_id;
      const date = new Date(item.archived_at).toLocaleDateString("da-DK");

      const key = `${id}-${date}`;

      if (!grouped[key]) {
        grouped[key] = {
          id,
          name: item.customer_name,
          numberOfCars: item.number_of_cars,
          totalBudget: item.total_budget,
          leads: item.leads,
          saleConversions: item.sale_conversions || 0,
          budgetPerDay: item.budget_per_day || 0,
          conversionPercent: item.conversion_percent || 0,
          archived_at: item.archived_at
        };
      } else {
        grouped[key].leads += item.leads;
        grouped[key].saleConversions += item.sale_conversions || 0;
        grouped[key].totalBudget += item.total_budget;
      }
    });

    const history = Object.values(grouped);

    return { history, totalCount: history.length };
  } catch (err) {
    console.error("Fejl ved hentning af salgshistorik:", err);
    return { history: [], totalCount: 0 };
  }
}
