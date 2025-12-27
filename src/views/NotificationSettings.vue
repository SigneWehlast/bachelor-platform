<script setup>
import NotificationSettingsComp from '@/components/NotificationSettingsComp.vue';
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import { saveSettings, loadSettings } from '@/services/notificationService';
import { ref, onMounted } from 'vue';

const saved = ref(false);
const saving = ref(false);

onMounted(() => loadSettings());

const handleSave = async () => {
  saving.value = true;
  await new Promise(r => setTimeout(r, 500));
  saveSettings();
  saving.value = false;
  saved.value = true;
  setTimeout(() => saved.value = false, 2000);
};
</script>
<template>
  <div>
    <div class='settings-topbar'>
      <h1>Indstillinger</h1>
        <button class='settings-topbar__btn' @click="handleSave">
          <span v-if="saving" class="settings-topbar__btn-spinner"></span>
          <span v-else>Gem</span>
      </button>    
    </div>
    <p class='regular settings-breadcrumbs'>  
    <BreadcrumbsComp/>
  </p>
    <div class='settings'>
      <div class='settings-content'>
        <NotificationSettingsComp :saved='saved' />
      </div>
    </div>
  </div>
</template>