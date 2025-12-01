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
        <th>{{ props.showId ? 'ID' : 'Kundenavn' }}</th>
        <th>Antal biler</th>
        <th>Samlet Budget</th>
        <th>Konverteringer</th>
        <th>Carboost konverteringer</th>
        <th>Budget pr dag</th>
        <th>Konvertering i procent</th>
      </template>

      <template #rows>
        <tr v-for="item in props.carsData" :key="item.customer_id">
          <td>{{ showId ? item.id : item.name }}</td>
          <td>{{ item.numberOfCars }}</td>
          <td>{{ item.totalBudget }}</td>
          <td>{{ item.leads }}</td>
          <td>{{ item.carboostConversions }}</td>
          <td>{{ item.budgetPerDay }}</td> 
          <td>{{ item.conversionPercent }}</td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>
