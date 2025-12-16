import { ref, computed, watch } from "vue";

export function usePagination(items, pageSize = 10, options = {}) {
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / pageSize))
  );

  const paginatedItems = computed(() => {
    if (options.disable?.value) {
      return items.value;
    }

    const start = (currentPage.value - 1) * pageSize;
    return items.value.slice(start, start + pageSize);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const resetPage = () => {
    currentPage.value = 1;
  };

  watch(items, resetPage);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    resetPage
  };
}