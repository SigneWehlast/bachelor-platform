const BASE_URL = import.meta.env.VITE_BASE_URL;
import { getCustomerStats } from './customerStatsService';

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
    const historyData = Array.isArray(result) ? result : [];

    // Normaliser valgte kunde-IDs
    const numericCustomerIds = customerIds.map(c => Number(c)).filter(Number.isFinite);

    // Hent alle kunder for at få name og id
    const allCustomers = await getCustomerStats();

    const grouped = {};

    // Først fyld historik
    historyData.forEach(h => {
      const id = Number(h.customer_id);
      if (numericCustomerIds.length > 0 && !numericCustomerIds.includes(id)) return;

      const dateKey = h.archived_at ? h.archived_at.split('T')[0] : 'no-date';
      const key = `${id}-${dateKey}`;

      if (!grouped[key]) {
        grouped[key] = {
          id,
          name: h.customer_name,
          numberOfCars: h.number_of_cars || 0,
          totalBudget: h.total_budget || 0,
          leads: h.leads || 0,
          carboostConversions: h.carboost_conversions || 0,
          archived_at: h.archived_at || null,
          hasHistory: !!h.archived_at
        };
      }
    });

    // Tilføj kunder uden historik
    numericCustomerIds.forEach(id => {
      const exists = Object.values(grouped).some(g => g.id === id);
      if (!exists) {
        const customer = allCustomers.find(c => c.id === id);
        grouped[`${id}-no-date`] = {
          id,
          name: customer?.name || `Kunde ${id}`,
          numberOfCars: customer?.numberOfCars || 0,
          totalBudget: customer?.totalBudget || 0,
          leads: customer?.leads || 0,
          carboostConversions: customer?.carboostConversions || 0,
          archived_at: null,
          hasHistory: false
        };
      }
    });

    const history = Object.values(grouped).map(h => ({
      ...h,
      budgetPerDay: h.numberOfCars > 0 ? Number((h.totalBudget / (h.numberOfCars * 30)).toFixed(1)) : 0,
      conversionPercent: h.leads > 0 ? Number(((h.carboostConversions / h.leads) * 100).toFixed(1)) : 0
    }));

    return { history, totalCount: history.length };

  } catch (err) {
    console.error('Fejl ved hentning af salgshistorik:', err);
    return { history: [], totalCount: 0 };
  }
}