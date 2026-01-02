import { ref, computed } from 'vue';

export function useSearchFilter(items, searchField = 'name', filterField = null) {
  const searchQuery = ref('');
  const filterValue = ref(null);

  const filteredItems = computed(() => {
    let filtered = items.value;

    if (searchQuery.value.trim() !== '') {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(item => String(item[searchField]).toLowerCase().includes(query));
    }

    return filtered;
  });

  return { searchQuery, filterValue, filteredItems };
}
