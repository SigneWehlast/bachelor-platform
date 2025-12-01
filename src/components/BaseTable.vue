<template>
    <table>
      <thead>
        <tr>
          <slot name="header"></slot>
        </tr>
      </thead>
      <tbody>
        <slot name="rows"></slot>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    name: "BaseTable",
  };
  </script>
  