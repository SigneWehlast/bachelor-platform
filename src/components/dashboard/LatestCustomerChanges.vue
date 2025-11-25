<script setup>
    import LatestCustomerChangesContent from './LatestCustomerChangesContent.vue';
</script>
<template>
    <div class="latest-customer-changes">
        <div class="latest-customer-changes__topbar">
           <h1>Seneste kundeændringer</h1>
           <!--icon-->
           <button class="latest-customer-changes__topbar-btn">Vis alle</button>
        </div>           
        <latest-customer-changes-content layout="space-between" />
    </div>
</template>