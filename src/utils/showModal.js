import { ref } from "vue";

export function useShowModal() {
  const showModal = ref(false);
  const onConfirmCallback = ref(null);

  function openModal(callback) {
    onConfirmCallback.value = callback;
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    onConfirmCallback.value = null;
  }

  function confirmYes() {
    if (onConfirmCallback.value) onConfirmCallback.value();
    closeModal();
  }

  return { showModal, openModal, closeModal, confirmYes };
}
