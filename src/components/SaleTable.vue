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
  }
});

</script>

<template>
  <div>

    <BaseTable>
      <template #header>
        <th class="carboost-table__text--leftalign">{{ props.showId ? 'ID' : 'Kundenavn' }}</th>
        <th>Antal biler</th>
        <th>Samlet Budget</th>
        <th>Konverteringer</th>
        <th>Carboost konverteringer</th>
        <th>Budget pr dag</th>
        <th class="carboost-table__text--leftalign">Konvertering i procent</th>
      </template>

      <template #rows>
        <tr v-for="item in props.carsData" :key="item.customer_id">
          <td class="carboost-table__text--leftalign">{{ showId ? item.id : item.name }}</td>
          <td class="carboost-table__text--center">{{ item.numberOfCars }}</td>
          <td class="carboost-table__text--center">{{ item.totalBudget }}kr</td>
          <td class="carboost-table__text--center">{{ item.leads }}</td>
          <td class="carboost-table__text--center">{{ item.carboostConversions }}</td>
          <td class="carboost-table__text--center">{{ item.budgetPerDay }}kr</td> 
          <td class="carboost-table__text--center">{{ item.conversionPercent }}%</td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>
