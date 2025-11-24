<script setup>
import { ref } from 'vue';
const customers = ref([
  { name: "Bjarnes biler har tilmeldt sig CarBoost", date: "11-11-2025 09:10" },
  { name: "Thomsens Auto har opsagt CarBoost", date: "01-11-2025 11:39" },
  { name: "Autotorvet har opgraderet sit abonnement", date: "21-10-2025 15:42"},
  { name: "Billi Billi har tilmeldt sig CarBoost", date: "14-10-2025 16:03"},
  { name: "SIXT Bilsalg har tilmeldt sig CarBoost", date: "30-09-2025 14:56"}
]);
</script>
<template>
    <div class="latest-customer-changes">
        <div class="latest-customer-changes__topbar">
           <h1>Seneste kundeændringer</h1>
           <!--icon-->
           <button class="latest-customer-changes__topbar-btn">Vis alle</button>
        </div>
        <div class="latest-customer-changes__content">
            <div class="latest-customer-changes__content-titles">
                <h3>Kundenavn</h3>
                <h3>Dato</h3>
            </div>
            <div class="latest-customer-changes__content-list-wrapper">
                <div v-for="(customer, index) in customers" :key="index" class="latest-customer-changes__content-list">
                    <div class="latest-customer-changes__content-list-name">{{ customer.name }}</div> 
                    <div class="latest-customer-changes__content-list-date">{{ customer.date }}</div>
                </div>
            </div>
        </div>
    </div>
</template>