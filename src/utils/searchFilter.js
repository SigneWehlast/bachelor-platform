// src/utils/searchFilter.js
import { ref, computed } from "vue";

/**
 * Genanvendelig filtrering til lister
 * @param {Array} items - array af objekter som skal filtreres
 * @param {String} searchField - felt i objektet til søgning, fx "name"
 * @param {String|null} filterField - felt til ekstra filter, fx "numberOfCars"
 * @returns {Object} { searchQuery, filterValue, filteredItems }
 */
export function useSearchFilter(items, searchField = "name", filterField = null) {
  const searchQuery = ref("");
  const filterValue = ref(null);

  const filteredItems = computed(() => {
    let filtered = items.value;

    // Filtrer på filterField, fx antal biler
    if (filterField && filterValue.value && filterValue.value !== "Alle") {
      const [min, maxText] = filterValue.value.split(" - ");
      const minNum = parseInt(min);
      const maxNum = maxText.includes("+") ? Infinity : parseInt(maxText.replace(/\D/g, ""));
      filtered = filtered.filter(item => item[filterField] >= minNum && item[filterField] <= maxNum);
    }

    // Filtrer på søgeinput
    if (searchQuery.value.trim() !== "") {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(item => String(item[searchField]).toLowerCase().includes(query));
    }

    return filtered;
  });

  return { searchQuery, filterValue, filteredItems };
}
