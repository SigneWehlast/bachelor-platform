<script setup>
import { ref, onMounted } from "vue";
import Dropdown from './Dropdown.vue';
import { getMonths } from "@/services/calendarService";

const displayOptions = ref([]);
const selectedMonth = ref(null);

onMounted(async () => {
  displayOptions.value = await getMonths();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const exists = displayOptions.value.find(o => o.value === currentMonth);

  selectedMonth.value = exists
    ? currentMonth
    : displayOptions.value[0]?.value ?? null;
});
</script>

<template>
  <Dropdown
      v-model="selectedMonth"
      :options="displayOptions"
      label="Vælg måned"
  />
</template>