<script setup>
import { ref, onMounted, watch } from 'vue';

//Components
import Dropdown from '../filter/Dropdown.vue';

//Service
import { getCustomerStats } from '@/services/customerStatsService';

const conversions = ref([
  { name: 'Gns konverteringer', data: '-', description: '' },
  { name: 'Gns CarBoost andel', data: '-', description: '' },
  { name: 'Gns Pris pr. bil pr. dag', data: '-', description: '' },
  { name: 'Gns antal biler', data: '-'}
]);

const segmentOptions = [
  '0 - 1000 kr.',
  '1001 - 2000 kr.',
  '2001 - 3000 kr.',
  '3001 - 4000 kr.',
  '4001+ kr.'
];

const selectedSegment = ref(segmentOptions[0]);
const customerData = ref([]);

function parseBudgetSegment(segment) {
  const cleaned = segment.replace('kr.', '').trim();

  if (cleaned.includes('+')) {
    const min = parseInt(cleaned);
    return { min, max: Infinity };
  }

  const [min, max] = cleaned
    .split('-')
    .map(v => parseInt(v.trim()));

  return { min, max };
}

function updateConversionsBudget() {
  const { min, max } = parseBudgetSegment(selectedSegment.value);

  const filtered = customerData.value.filter(c =>
    c.totalBudget >= min && c.totalBudget <= max
  );

  if (filtered.length === 0) {
    conversions.value.forEach(c => {
      c.data = '0';
      c.description = 'Ingen data';
    });
    return;
  }

  const totalLeads = filtered.reduce((acc, c) => acc + c.leads, 0);
  const totalCarBoost = filtered.reduce((acc, c) => acc + c.carboostConversions, 0);
  const totalCars = filtered.reduce((acc, c) => acc + c.numberOfCars, 0);

  const overallCarBoost = customerData.value.reduce((acc, c) => acc + c.carboostConversions, 0);

  const budgetPerDayArr = filtered.map(c =>
    c.numberOfCars > 0 ? Number((c.totalBudget / (c.numberOfCars * 30)).toFixed(1)) : 0
  );

  const avgBudgetPerDay = (
    budgetPerDayArr.reduce((acc, v) => acc + v, 0) / budgetPerDayArr.length
  ).toFixed(1);

  conversions.value[0].data = (totalLeads / filtered.length).toFixed(0);
  conversions.value[1].data = (totalCarBoost / filtered.length).toFixed(0);
  conversions.value[2].data = avgBudgetPerDay + ' kr.';
  conversions.value[3].data = (totalCars / filtered.length).toFixed(0);

  conversions.value[0].description =
    totalLeads / filtered.length > 50 ? '(+) Høj konvertering' : 'Stabil';

  conversions.value[1].description =
    overallCarBoost > 0
      ? ((totalCarBoost / overallCarBoost) * 100).toFixed(1) + '% af totalen'
      : '0% af totalen';

  conversions.value[2].description =
    avgBudgetPerDay < 5 ? '(lav – høj effektivitet)' : '(høj – tjek budget)';

}

onMounted(async () => {
  const data = await getCustomerStats();
  customerData.value = data;
  updateConversionsBudget();
});

watch(selectedSegment, updateConversionsBudget);
</script>

<template>
    <div class='conversion-data-budget'>
        <h1 class='conversion-data-budget__title'>Konverteringsdata budget</h1>
        <Dropdown
          v-model='selectedSegment'
          :options='segmentOptions'
          label='Segment'
          selectedPrefix='Segment'
        />
        <div class='conversion-data-budget__content'>
            <div v-for='(conversion, index) in conversions' :key='index' class='conversion-data-budget__content__box'>
                <div class='conversion-data-budget__content__box-name h3'>{{ conversion.name }}</div>
                <div class='conversion-data-budget__content__box-data h1'>{{ conversion.data }}</div>
                <div class='conversion-data-budget__content__box-description'>{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>