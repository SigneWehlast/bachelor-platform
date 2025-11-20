<script setup>
import SettingsNavigation from '@/components/SettingsNavigation.vue';
import NotificationSettingsComp from '@/components/NotificationSettingsComp.vue';
</script>
<template>
    <div>
        <h1>Indstillinger</h1>
        <div class="notification-settings">
            <div class="notification-settings__navigation">
                <SettingsNavigation />
            </div>
            <div class="notification-settings__content">
                <NotificationSettingsComp />
            </div>
        </div>    
    </div>

</template>