<script setup>
import { ref, onMounted, watch } from 'vue';

//Components
import Dropdown from '../filter/Dropdown.vue';

//Service
import { getCustomerStats } from '@/services/customerStatsService';

const conversionsCars = ref([
  { name: 'Gns konverteringer', data: '-', description: '' },
  { name: 'Gns CarBoost konverteringer', data: '-', description: '' },
  { name: 'Gns Pris pr. bil pr. dag', data: '-', description: '' },
  { name: 'Gns antal biler', data: '-', description: '' }
]);

const segmentOptions = [
  '0 - 25 biler',
  '26-50 biler',
  '51-75 biler',
  '76-100 biler',
  '101-125 biler',
  '126-150 biler',
  '151-175 biler',
  '176-200 biler',
  '200+ biler'
];

const selectedSegment = ref(segmentOptions[0]);
const customerData = ref([]);

//parsing segment text for min/maz values
function parseSegment(segment) {
  if (segment === '200+ biler') return { min: 201, max: Infinity };
  const [min, max] = segment.split('-').map(s => parseInt(s.trim()));
  return { min, max };
}

//Update data based on chosen segment
function updateConversions() {
  const { min, max } = parseSegment(selectedSegment.value);
  const filtered = customerData.value.filter(c => c.numberOfCars >= min && c.numberOfCars <= max);

  if (filtered.length === 0) {
    conversionsCars.value.forEach(c => {
      c.data = '0'; c.description = 'Ingen data';
    });
    return;
  }

  // Segment totals
  const segmentTotalLeads = filtered.reduce((acc, c) => acc + c.leads, 0);
  const segmentTotalCarBoost = filtered.reduce((acc, c) => acc + c.carboostConversions, 0);
  const segmentTotalCars = filtered.reduce((acc, c) => acc + c.numberOfCars, 0);

  // Overall totals
  const overallTotalCarBoost = customerData.value.reduce((acc, c) => acc + c.carboostConversions, 0);

  //Calculate pris pr. bil pr. dag per kunde and average
  const budgetPerDayArray = filtered.map(c =>
    c.numberOfCars > 0 ? Number((c.totalBudget / (c.numberOfCars * 30)).toFixed(1)) : 0
  );

  const avgBudgetPerDay = (budgetPerDayArray.reduce((acc, val) => acc + val, 0) / budgetPerDayArray.length).toFixed(1);

  // update data
  conversionsCars.value[0].data = (segmentTotalLeads / filtered.length).toFixed(0);
  conversionsCars.value[1].data = (segmentTotalCarBoost / filtered.length).toFixed(0);
  conversionsCars.value[2].data = avgBudgetPerDay;
  conversionsCars.value[3].data = (segmentTotalCars / filtered.length).toFixed(0);

  // update dynamic descriptions
  conversionsCars.value[0].description = (segmentTotalLeads / filtered.length) > 50 ? 'Høj konvertering' : 'Stabil';
  conversionsCars.value[1].description = overallTotalCarBoost > 0
    ? ((segmentTotalCarBoost / overallTotalCarBoost) * 100).toFixed(1) + '% af totalen'
    : '0% af totalen';
  conversionsCars.value[2].description = avgBudgetPerDay < 10 ? 'Lav - god økonomi' : 'Høj - tjek budget';
  conversionsCars.value[3].description = (segmentTotalCars / filtered.length) > 100 ? 'Stort segment' : 'Mindre segment';
}

// Get data when the component is mounted
onMounted(async () => {
  try {
    const data = await getCustomerStats();
    customerData.value = data;
    updateConversions();
  } catch (err) {
    console.error('Error while getting stats:', err);
  }
});

// Watcher on selectedSegment
watch(selectedSegment, () => {
  updateConversions();
});
</script>
<template>
  <div class='conversion-data-cars'>
    <h1 class='conversion-data-cars__title'>Konverteringsdata biler</h1>
    <Dropdown
      v-model='selectedSegment'
      :options='segmentOptions'
      label='Segment'
      selected-prefix='Segment'
    />
    <div class='conversion-data-cars__content'>
      <div
        v-for='(conversion, index) in conversionsCars'
        :key='index'
        class='conversion-data-cars__content__box'
      >
        <div class='conversion-data-cars__content__box-name h3'>{{ conversion.name }}</div>
        <div class='conversion-data-cars__content__box-data h1'>{{ conversion.data }}</div>
        <div class='conversion-data-cars__content__box-description'>{{ conversion.description }}</div>
      </div>
    </div>
  </div>
</template>