export function sortByName(arr, field = "customer_name") {
  return arr.sort((a, b) => {
    if (!a[field] || !b[field]) return 0;
    return a[field].localeCompare(b[field]);
  });
}