<script setup>
import { ref } from 'vue';
const overviews = ref([
  { name: "Advarsler", data: "2" },
  { name: "Carboost Kunder", data: "50" },
  { name: "CarWeb kunder", data: "150"},
  { name: "CarShop kunder", data: "50"},
  { name: "CarScript kunder", data: "150"}
]);
</script>
<template>
    <div class="mdkmedia-overview">
        <h1 class="mdkmedia-overview__title">MDK-Media Oversigt</h1>
        <div class="mdkmedia-overview__content">
            <div v-for="(overview, index) in overviews" :key="index" class="mdkmedia-overview__content__box">
                <div class="mdkmedia-overview__content__box-name h3">{{ overview.name }}</div>
                <div class="mdkmedia-overview__content__box-data h1">{{ overview.data }}</div>
            </div>
        </div>
    </div>
</template>