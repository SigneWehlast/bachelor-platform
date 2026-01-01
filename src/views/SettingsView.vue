<script setup>
//Components
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';

</script>
<template>
   <div>
       <div class='settings-topbar'>
           <h1>Indstillinger</h1>
           <button class='settings-topbar__btn'>Gem</button>
       </div>
       <p class='regular settings-breadcrumbs'>
        <BreadcrumbsComp/>
      </p>
   </div>


</template>
