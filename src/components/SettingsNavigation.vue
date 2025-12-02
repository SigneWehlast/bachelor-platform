<script setup>
import { ref } from "vue"


const items = [
 "Bruger indstillinger",
 "Notifikations indstillinger",
 "Lokation",
 "Faciliteter",
 "Integrationer",
 "Medier",
 "Bannerboost",
 "CarBoost",
 "CarShop",
 "Hjemmeside",
 "Produkter"
]


const activeItem = ref("Notifikations indstillinger")
</script>


<template>
 <ul class="settings-navigation">
   <li
     v-for="item in items"
     :key="item"
     :class="[
       'settings-navigation__item',
       'h4',
       { 'is-active': activeItem === item }
     ]"
   >
     {{ item }}
   </li>
 </ul>
</template>
