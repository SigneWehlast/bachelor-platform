<script setup>
import { ref } from "vue";
import BaseTable from './BaseTable.vue';

const props = defineProps({
  carsData: {
    type: Array,
    required: true
  }
});

const showId = ref(false);
</script>

<template>
  <div>
    <label>
      <input type="checkbox" v-model="showId" /> Vis ID i stedet for navn
    </label>

    <BaseTable>
      <template #header>
        <th>{{ showId ? 'ID' : 'Kundenavn' }}</th>
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
