<script setup>
import SettingsNavigation from '@/components/SettingsNavigation.vue';
import NotificationSettingsComp from '@/components/NotificationSettingsComp.vue';
</script>
<template>
   <div>
       <div class="settings-topbar">
           <h1>Indstillinger</h1>
           <button class="settings-topbar__btn">Gem</button>
       </div>
       <p class="regular settings-breadcrumbs">Breadcrumbs</p>
       <div class="settings">
           <div class="settings-navigation">
               <SettingsNavigation />
           </div>
           <div class="settings-content">
               <NotificationSettingsComp />
           </div>
       </div>   
   </div>


</template>
