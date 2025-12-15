import { ref, computed } from "vue";

export function useSearchFilter(items, searchField = "name", filterField = null) {
  const searchQuery = ref("");
  const filterValue = ref(null);

  const filteredItems = computed(() => {
    let filtered = items.value;

    if (filterField && filterValue.value && filterValue.value !== "Alle") {
      const [min, maxText] = filterValue.value.split(" - ");
      const minNum = parseInt(min);
      const maxNum = maxText.includes("+") ? Infinity : parseInt(maxText.replace(/\D/g, ""));
      filtered = filtered.filter(item => item[filterField] >= minNum && item[filterField] <= maxNum);
    }

    if (searchQuery.value.trim() !== "") {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(item => String(item[searchField]).toLowerCase().includes(query));
    }

    return filtered;
  });

  return { searchQuery, filterValue, filteredItems };
}
