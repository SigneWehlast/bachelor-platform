<script setup>
import Icon from '@/components/Icon.vue';

const emit = defineEmits(['yes', 'no']);

function handleYes() {
  emit('yes');
}

function handleNo() {
  emit('no');
}
</script>

<template>
  <div class='confirmation-modal'>
    <div class='confirmation-modal__content'>
      <div class='confirmation-modal__icon-wrapper'>
        <Icon @click='handleNo' name='Close' class='confirmation-modal__icon' />
      </div>
      <p>Er du sikker på, at du vil fjerne anonymisering?</p>
      <div class='confirmation-modal__buttons-wrapper'>
        <button class='confirmation-modal__button' @click='handleNo'>Nej</button>
        <button class='confirmation-modal__button confirmation-modal__button--yes' @click='handleYes'>Ja</button>
      </div>
    </div>
  </div>
</template>
