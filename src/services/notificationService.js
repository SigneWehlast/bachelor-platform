import { reactive, computed } from 'vue';

const state = reactive({
  'leads-down': false,
  'leads-up': false,
  'leads-stop': false
});

export const leadsEnabled = computed(
  () => state['leads-down'] || state['leads-up'] || state['leads-stop']
);

export function loadSettings() {
  const saved = localStorage.getItem('leadsSettings');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  }
}

export function saveSettings() {
  localStorage.setItem('leadsSettings', JSON.stringify(state));
  console.log('Gemte settings:', state);
}

export function getSettings() {
  return state;
}
