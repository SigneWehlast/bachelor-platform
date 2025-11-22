<script setup>
import { trackingStore } from "@/utils/trackingStore";
</script>

<template>
  <div class="Beadcrums__warpper"></div>


  <p v-if="trackingStore.lastMessage">
    {{ trackingStore.lastMessage }}
  </p>
</template>
