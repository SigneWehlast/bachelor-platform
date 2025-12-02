<script setup>
import { ref } from 'vue';
const props = defineProps({
  layout: {
    type: String,
    default: 'space-between'
  }
})

const customers = ref([
  { name: "Bjarnes biler har tilmeldt sig CarBoost", date: "11-11-2025 09:10" },
  { name: "Thomsens Auto har opsagt CarBoost", date: "01-11-2025 11:39" },
  { name: "Autotorvet har opgraderet sit abonnement", date: "21-10-2025 15:42"},
  { name: "Billi Billi har tilmeldt sig CarBoost", date: "14-10-2025 16:03"},
  { name: "SIXT Bilsalg har tilmeldt sig CarBoost", date: "30-09-2025 14:56"}
]);
</script>

<template>
  <div
    class="latest-customer-changes__content"
    :class="{
      'layout-space-between': props.layout === 'space-between',
      'layout-gap': props.layout === 'gap'
    }"
  >
    <div class="latest-customer-changes__content-names">
      <h3 class="latest-customer-changes__content-title">Kundenavn</h3>
      <div v-for="(customer, index) in customers" :key="index">
        <div class="text-medium">{{ customer.name }}</div> 
      </div> 
    </div>

    <div class="latest-customer-changes__content-dates">
      <h3 class="latest-customer-changes__content-title">Dato</h3>
      <div v-for="(customer, index) in customers" :key="index">
        <div class="text-medium">{{ customer.date }}</div>
      </div>
    </div>
  </div>
</template>
