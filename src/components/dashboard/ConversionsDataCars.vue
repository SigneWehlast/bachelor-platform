<script setup>
import { ref } from 'vue';
const conversionsCars = ref([
  { name: "Gns konverteringer", data: "2", description: "(+) Stabil" },
  { name: "Gns CarBoost konverteringer", data: "50", description: "47,97% af totalen" },
  { name: "Gns Pris pr. bil pr. dag", data: "3,19 kr.", description: "(lav - god økonomi)"},
  { name: "Gns antal biler", data: "87", description: "--"}
]);
</script>
<template>
    <div class="conversion-data-cars">
        <h1 class="conversion-data-cars__title">Konverteringsdata cars</h1>
        <div>Segment: 0 - 10</div>
        <div class="conversion-data-cars__content">
            <div v-for="(conversion, index) in conversionsCars" :key="index" class="conversion-data-cars__content__box">
                <div class="conversion-data-cars__content__box-name h3">{{ conversion.name }}</div>
                <div class="conversion-data-cars__content__box-data h1">{{ conversion.data }}</div>
                <div class="conversion-data-cars__content__box-description">{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>