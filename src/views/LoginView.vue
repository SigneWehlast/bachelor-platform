<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const message = ref("");

async function login() {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";
  } catch (err) {
    console.error("Login error");
  }
}
</script>

<template>
  <div class="login">
    <div class="login__blank"></div>
    <div class="login__form">
      <h1>Log på CarAds platform</h1>
      <form class="login-form" @submit.prevent="login">
        <div class="login-form__group h3">
          <label>Email</label>
          <input v-model="email" type="email" required class="login-form__input">
        </div>
        <div class="login-form__group h3">
          <label>Adgangskode</label>
          <input v-model="password" type="password" required class="login-form__input">
        </div>
        <div class="login-form__group">
          <button type="submit" class="login-form__btn">Login</button>
          <p class="medium">{{ message }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
