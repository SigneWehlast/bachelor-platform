import { ref } from "vue";

export function useGoBack() {
  const showTable = ref(false);

  function goBack() {
    showTable.value = false;
  }

  function show() {
    showTable.value = true;
  }

  return {
    showTable,
    goBack,
    show
  };
}
