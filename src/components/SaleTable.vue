<script setup>
import BaseTable from './BaseTable.vue';

const props = defineProps({
  carsData: {
    type: Array,
    required: true
  },
  showId: {
    type: Boolean,
    required: true
  },
  visibleColumns: {
    type: Array,
    required: true
  }
});
</script>
<template>
  <div>
    <BaseTable>
      <template #header>
        <th class="carboost-table__text--leftalign">{{ props.showId ? 'ID' : 'Kundenavn' }}</th>
        <th>Antal biler</th>
        <th v-if="props.visibleColumns.includes('totalBudget')">Samlet Budget</th>
        <th v-if="props.visibleColumns.includes('conversions')">Konverteringer</th>
        <th v-if="props.visibleColumns.includes('carboostConversions')">Carboost konverteringer</th>
        <th v-if="props.visibleColumns.includes('budget')">Budget pr dag</th>
        <th v-if="props.visibleColumns.includes('conversionsPercent')" class="carboost-table__text--leftalign">Konvertering i procent</th>
      </template>

      <template #rows>
        <tr v-for="item in props.carsData" :key="item.customer_id">
          <td  class="carboost-table__text--leftalign">{{ showId ? item.id : item.name }}</td>
          <td class="carboost-table__text--center">{{ item.numberOfCars }}</td>
          <td v-if="props.visibleColumns.includes('totalBudget')" class="carboost-table__text--center">{{ item.totalBudget }}kr</td>
          <td v-if="props.visibleColumns.includes('conversions')" class="carboost-table__text--center">{{ item.leads }}</td>
          <td v-if="props.visibleColumns.includes('carboostConversions')" class="carboost-table__text--center">{{ item.carboostConversions }}</td>
          <td v-if="props.visibleColumns.includes('budget')" class="carboost-table__text--center">{{ item.budgetPerDay }}kr</td> 
          <td v-if="props.visibleColumns.includes('conversionsPercent')" class="carboost-table__text--center">{{ item.conversionPercent }}%</td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>
