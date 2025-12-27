const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getHistoryCarboost() {
  try {
    const res = await fetch(`${BASE_URL}/api/history/carboost`);
    const result = await res.json();
    const data = Array.isArray(result) ? result : [];
    const grouped = {};

    data.forEach(item => {
      const id = item.customer_id;
      const date = new Date(item.archived_at).toLocaleDateString('da-DK');

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
    console.error('Fejl ved hentning af historik:', err);
    return { history: [], totalCount: 0 };
  }
}

export async function getHistorySales(customerIds = []) {
  try {
    const res = await fetch(`${BASE_URL}/api/history/sales`);
    const result = await res.json();

    const data = Array.isArray(result) ? result : [];
    const grouped = {};

    data.forEach(h => {
      if (!h.archived_at) return;

      const id = h.customer_id;

      if (customerIds.length > 0 && !customerIds.includes(id)) return;

      const date = new Date(h.archived_at).toLocaleDateString('da-DK');
      const key = `${id}-${date}`;

      if (!grouped[key]) {
        grouped[key] = {
          id,
          name: h.customer_name,
          numberOfCars: h.number_of_cars || 0,
          totalBudget: h.total_budget || 0,
          leads: h.leads || 0,
          carboostConversions: h.carboost_conversions || 0,
          archived_at: h.archived_at
        };
      } else {
        grouped[key].leads += h.leads || 0;
        grouped[key].carboostConversions += h.carboost_conversions || 0;
        grouped[key].totalBudget += h.total_budget || 0;
        grouped[key].numberOfCars += h.number_of_cars || 0;
      }
    });

    const history = Object.values(grouped).map(h => ({
      ...h,
      budgetPerDay: h.numberOfCars > 0
        ? Number((h.totalBudget / (h.numberOfCars * 30)).toFixed(1))
        : 0,
      conversionPercent: h.leads > 0
        ? Number(((h.carboostConversions / h.leads) * 100).toFixed(1))
        : 0
    }));

    return { history, totalCount: history.length };
  } catch (err) {
    console.error('Fejl ved hentning af salgshistorik:', err);
    return { history: [], totalCount: 0 };
  }
}