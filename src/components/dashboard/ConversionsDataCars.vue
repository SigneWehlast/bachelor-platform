<script setup>
import { ref } from 'vue';
import Dropdown from '../filter/Dropdown.vue';

const conversionsCars = ref([
  { name: "Gns konverteringer", data: "2", description: "(+) Stabil" },
  { name: "Gns CarBoost konverteringer", data: "50", description: "47,97% af totalen" },
  { name: "Gns Pris pr. bil pr. dag", data: "3,19 kr.", description: "(lav - god økonomi)"},
  { name: "Gns antal biler", data: "87", description: "--"}
]);

const segmentOptions = [
  "0 - 25 biler",
  "26-50 biler",
  "51-75 biler",
  "76-100 biler",
  "101-125 biler",
  "126-150 biler",
  "151-175 biler",
  "176-200 biler",
  "200+ biler"
];

const selectedSegment = ref(segmentOptions[0]);

</script>
<template>
    <div class="conversion-data-cars">
        <h1 class="conversion-data-cars__title">Konverteringsdata biler</h1>
        <Dropdown
            v-model="selectedSegment"
            :options="segmentOptions"
            label="Segment"
        >
        </Dropdown>     
        <div class="conversion-data-cars__content">
            <div v-for="(conversion, index) in conversionsCars" :key="index" class="conversion-data-cars__content__box">
                <div class="conversion-data-cars__content__box-name h3">{{ conversion.name }}</div>
                <div class="conversion-data-cars__content__box-data h1">{{ conversion.data }}</div>
                <div class="conversion-data-cars__content__box-description">{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>