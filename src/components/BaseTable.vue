  <script setup>

  </script>
  <template>
    <table class="base-table">
      <thead class="base-table__head h3">
        <tr>
          <slot name="header"></slot>
        </tr>
      </thead>
      <tbody class="base-table__body text-medium">
        <slot name="rows"></slot>
      </tbody>
    </table>
  </template>
  

  