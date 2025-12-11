<script setup>
import NotificationSettingsComp from '@/components/NotificationSettingsComp.vue';
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';

</script>
<template>
   <div>
       <div class="settings-topbar">
           <h1>Indstillinger</h1>
           <button class="settings-topbar__btn">Gem</button>
       </div>
       <p class="regular settings-breadcrumbs">  <BreadcrumbsComp/></p>
       <div class="settings">
               <NotificationSettingsComp />
       </div>   
   </div>


</template>
