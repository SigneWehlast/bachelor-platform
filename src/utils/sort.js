export function sortByName(arr, field = 'name') {
  return arr.sort((a, b) => {
    if (!a[field] || !b[field]) return 0;
    return a[field].localeCompare(b[field]);
  });
}