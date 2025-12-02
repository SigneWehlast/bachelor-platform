<script setup>
import { ref, onMounted } from 'vue';
import { getCustomersInGroups } from '@/config/groupOverviewService';

const overviews = ref([]);

const notifications = ref({name: "Advarsler", data: "2" });

onMounted(async () => {
  const data = await getCustomersInGroups();
    overviews.value = data.map(item => ({
    name: item.groupName,
    data: item.customerCount 
  }));
});
</script>
<template>
    <div class="mdkmedia-overview">
        <h1 class="mdkmedia-overview__title">MDK-Media Oversigt</h1>
        <div class="mdkmedia-overview__content">
           <div class="mdkmedia-overview__content__box">
                <div class="mdkmedia-overview__content__box-name h3">{{ notifications.name }}</div>
                <div class="mdkmedia-overview__content__box-data h1">{{ notifications.data }}</div>
           </div>
            <div v-for="(overview, index) in overviews" :key="index" class="mdkmedia-overview__content__box">
                <div class="mdkmedia-overview__content__box-name h3">{{ overview.name }}</div>
                <div class="mdkmedia-overview__content__box-data h1">{{ overview.data }}</div>
            </div>
        </div>
    </div>
</template>