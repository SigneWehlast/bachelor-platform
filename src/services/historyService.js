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

    data.forEach(c => {
      const id = c.customer_id;
      const date = c.archived_at.split(" ")[0];
      const key = `${id}-${date}`;

      if (!grouped[key]) {
        grouped[key] = {
          id,
          name: c.customer_name,
          numberOfCars: c.number_of_cars,
          totalBudget: c.total_budget,
          leads: c.leads,
          carboostConversions: c.carboost_conversions || 0,
          archived_at: c.archived_at
        };
      } else {
        grouped[key].leads += c.leads;
        grouped[key].carboostConversions += c.carboost_conversions || 0;
        grouped[key].totalBudget += c.total_budget;
        grouped[key].numberOfCars += c.number_of_cars;
      }
    });

    const history = Object.values(grouped).map(c => ({
      ...c,
      budgetPerDay: c.numberOfCars > 0
        ? Number((c.totalBudget / (c.numberOfCars * 30)).toFixed(1))
        : 0,
      conversionPercent: c.leads > 0
        ? Number(((c.carboostConversions / c.leads) * 100).toFixed(1))
        : 0
    }));

    return { history, totalCount: history.length };
  } catch (err) {
    console.error("Fejl ved hentning af salgshistorik:", err);
    return { history: [], totalCount: 0 };
  }
}

