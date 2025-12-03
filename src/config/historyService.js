export async function getHistoryCarboost() {
    try {  
      const res = await fetch("http://localhost:3000/api/history/carboost");
      const result = await res.json();
  
      console.log("Raw backend result:", result);
  
      const data = Array.isArray(result) ? result : [];
      const totalCount = data.length;
  
      const history = data.map(item => ({
        id: item.customer_id,
        name: item.customer_name, 
        leads: item.leads,
        archived_at: item.archived_at
      }));
  
      return { history, totalCount };
  
    } catch (err) {
      console.error("Fejl ved hentning af historik:", err);
      return { history: [], totalCount: 0 };
    }
  }