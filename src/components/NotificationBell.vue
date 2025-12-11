<script setup>
    import { ref } from "vue";
    import Icon from "@/components/Icon.vue";

    
    const open = ref(false);
    
    function toggleList() {
      open.value = !open.value;
    }
    </script>
    
    <template>
      <div class="notification-wrapper">
        <div class="bell" @click="toggleList">
          <Icon name="BellOutline" />
    
          <!-- Badge -->
          <span v-if="unreadCount > 0" class="badge">
            {{ unreadCount }}
          </span>
        </div>
    
        <!-- Dropdown liste -->
        <div v-if="open" class="notification-list">
          <div 
            class="item"
            v-for="n in notifications"
            :key="n.id"
            :class="{ unread: !n.isRead }"
          >
            <strong>{{ n.title }}</strong>
            <p>{{ n.message }}</p>
          </div>
        </div>
      </div>
    </template>
    
    <style scoped>
    .notification-wrapper {
      position: relative;
    }
    
    .bell {
      position: relative;
      cursor: pointer;
    }
    
    .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background-color: red;
      color: white;
      border-radius: 50%;
      padding: 2px 5px;
      font-size: 10px;
    }
    
    /* Dropdown */
    .notification-list {
      position: absolute;
      right: 0;
      width: 260px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      margin-top: 8px;
      padding: 10px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.15);
      z-index: 100;
    }
    
    .item {
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    
    .item:last-child {
      border-bottom: none;
    }
    
    .item.unread {
      font-weight: bold;
    }
    </style>
    