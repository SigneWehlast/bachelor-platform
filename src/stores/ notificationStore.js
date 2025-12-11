// src/stores/notificationStore.js
import { ref } from "vue";

// Liste over alle notifikationer
export const notifications = ref([]);

// Antal ulæste notifikationer (til badge på klokke)
export const unreadCount = ref(0);

/**
 * Tilføj en ny notifikation
 * @param {string} title - Titel på notifikationen
 * @param {string} message - Besked til brugeren
 * @param {string} type - "info" | "warning" | "danger" (valgfrit)
 */
export function pushNotification(title, message, type = "info") {
  const id = Date.now(); // unik id baseret på timestamp

  // tilføj notifikationen forrest i listen
  notifications.value.unshift({
    id,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date()
  });

  // opdater badge
  unreadCount.value = notifications.value.filter(n => !n.isRead).length;
}

/**
 * Marker en notifikation som læst
 * @param {number} id - id på notifikationen
 */
export function markAsRead(id) {
  const noti = notifications.value.find(n => n.id === id);
  if (noti) {
    noti.isRead = true;
  }

  // opdater badge
  unreadCount.value = notifications.value.filter(n => !n.isRead).length;
}

/**
 * Marker alle notifikationer som læst
 */
export function markAllAsRead() {
  notifications.value.forEach(n => (n.isRead = true));
  unreadCount.value = 0;
}
