<script setup>
import LatestCustomerChangesContent from './LatestCustomerChangesContent.vue';
import Tooltip from '../Tooltip.vue';
</script>
<template>
    <div class="latest-customer-changes">
        <div class="latest-customer-changes__topbar">
            <div class="latest-customer-changes__topbar-text">
           <h1>Seneste kundeændringer</h1><Tooltip type="customerChanges"/>
           </div>
           <RouterLink to="/dashboard/customerchanges" class="latest-customer-changes__topbar-btn">Vis alle</RouterLink>
        </div>
        <latest-customer-changes-content :customer-limit="5"/>
    </div>
</template>