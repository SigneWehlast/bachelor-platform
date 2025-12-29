import { reactive } from 'vue';

const settings = reactive({
  'leads-down': true,
  'leads-up': true,
  'leads-stop': true
});

export function getSettings() {
  return settings;
}

export function loadSettings() {
  const saved = localStorage.getItem('notificationSettings');
  if (saved) {
    Object.assign(settings, JSON.parse(saved));
  }
}

export function saveSettings() {
  localStorage.setItem('notificationSettings', JSON.stringify(settings));
}