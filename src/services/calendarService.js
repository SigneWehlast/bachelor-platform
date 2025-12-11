const BASE_URL = import.meta.env.VITE_BASE_URL 

export async function getMonths() {
  try {
    const res = await fetch(`${BASE_URL}/api/history/months`);
    if (!res.ok) throw new Error("Error while fetching months");
    const data = await res.json();

    return data.map(item => ({
      label: formatMonth(item.month),
      value: item.month
    }));
  } catch (err) {
    console.error("getMonths error:", err);
    return [];
  }
}

function formatMonth(monthString) {
  const [year, month] = monthString.split("-");
  const monthNames = [
      "Januar","Februar","Marts","April","Maj","Juni",
      "Juli","August","September","Oktober","November","December"
  ];
  return `${monthNames[month - 1]} ${year}`;
}
