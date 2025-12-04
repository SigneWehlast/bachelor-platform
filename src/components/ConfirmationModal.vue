<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["yes", "no"]);

function handleYes() {
  emit("yes");
}

function handleNo() {
  emit("no");
}
</script>

<template>
  <div class="confirmation-modal">
    <div class="confirmation-modal__content">
      <p>Er du sikker på, at du vil fjerne anonymisering?</p>
      <div class="confirmation-modal__buttonsWrapper">
        <button class="confirmation-modal__buttons" @click="handleNo">Nej</button>
        <button class="confirmation-modal__buttons-yes" @click="handleYes">Ja</button>
      </div>
    </div>
  </div>
</template>
