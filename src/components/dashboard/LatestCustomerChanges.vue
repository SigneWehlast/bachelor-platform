<script setup>
    import LatestCustomerChangesContent from './LatestCustomerChangesContent.vue';
</script>
<template>
    <div class="latest-customer-changes">
        <div class="latest-customer-changes__topbar">
           <h1>Seneste kundeændringer</h1>
           <!--icon-->
           <RouterLink to="/dashboard/customerchanges" class="latest-customer-changes__topbar-btn">Vis alle</RouterLink>
        </div>           
        <latest-customer-changes-content :customer-limit="5"/>
    </div>
</template>