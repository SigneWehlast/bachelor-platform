import { ref, computed } from "vue";

const customers = ref([]);

export function useCarboostWarnings() {
  const setCustomers = (list) => {
    customers.value = list;
  };

  const warningCustomers = computed(() =>
    customers.value.filter(item =>
      item.yesterdays_dif > 9 &&
      (
        item.todays_dif / item.yesterdays_dif < 0.5 ||
        item.todays_dif / item.yesterdays_dif < 0.7
      )
    )
  );

  const hasWarnings = computed(() => warningCustomers.value.length > 0);
  const warningCount = computed(() => warningCustomers.value.length);

  return {
    setCustomers,
    warningCustomers,
    hasWarnings,
    warningCount
  };
}
