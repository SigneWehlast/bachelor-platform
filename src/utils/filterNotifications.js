export function matchesNotificationSettings(customer, settings) {
  if (customer.isRecent && settings['new-customers']) return true;

  const yesterday = customer.yesterdays_dif;
  const today = customer.todays_dif;

  if (settings['leads-down'] && yesterday > 9 && today / yesterday < 0.7) return true;
  if (settings['leads-up'] && yesterday > 0 && today / yesterday > 1.5) return true;

  return false;
}