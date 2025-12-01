export function sortByName(list) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }