<script setup>
import ConversionsDataBudget from '@/components/dashboard/ConversionsDataBudget.vue';
import ConversionsDataCars from '@/components/dashboard/ConversionsDataCars.vue';
import LatestCustomerChanges from '@/components/dashboard/LatestCustomerChanges.vue';
import MDKMediaOverview from '@/components/dashboard/MDKMediaOverview.vue';
</script>

<template>
    <div class='dashboard-view'>
        <div class='dashboard-view__section'>
            <LatestCustomerChanges />
        </div>
        <div class='dashboard-view__section'>
            <MDKMediaOverview />
        </div>
        <div class='dashboard-view__section'>
            <ConversionsDataBudget />
        </div>
        <div class='dashboard-view__section'>
            <ConversionsDataCars />
        </div>
    </div>
</template>