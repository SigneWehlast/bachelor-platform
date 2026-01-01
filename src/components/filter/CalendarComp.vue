<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Dropdown from './Dropdown.vue';
import { getMonths } from '@/services/calendarService';

const props = defineProps({
  modelValue: { type: String, default: null },
  hideDayOption: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const months = ref([]);
const selectedMonth = ref(props.modelValue);

const displayOptions = computed(() => {
  if (props.hideDayOption) {
    return months.value;
  }
  return [{ label: 'Dagsvisning', value: null }, ...months.value];
});

onMounted(async () => {
  const fetchedMonths = await getMonths();
  months.value = fetchedMonths;

  if (!selectedMonth.value) {
    selectedMonth.value = null;
  }
});

watch(selectedMonth, (val) => emit('update:modelValue', val));
watch(() => props.modelValue, (val) => selectedMonth.value = val);
</script>
<template>
  <Dropdown
    v-if='displayOptions.length'
    v-model='selectedMonth'
    :options='displayOptions'
    label='Vælg periode'
  />
</template>