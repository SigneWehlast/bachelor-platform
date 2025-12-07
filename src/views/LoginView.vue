<script setup>
import { ref } from "vue";
import logo from '@/assets/images/Carads_logo_dark_text.svg';

const email = ref("");
const password = ref("");

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
    <div class="login__right"> 
      <div  class="login__logo">
      <img :src="logo" alt="Carads Logo" class="login__logo" /></div>
      <div class="login__form">
        <h1>Log på CarAds platform</h1>
        <form class="login__form-formular" @submit.prevent="login">
          <div class="login__form-group h3">
            <label>Email</label>
            <input v-model="email" type="email" required class="login__form-input">
          </div>
          <div class="login__form-group h3">
            <label>Adgangskode</label>
            <input v-model="password" type="password" required class="login__form-input">
          </div>
          <div class="login__form-group">
            <button type="submit" class="login__form-btn">Login</button>
            <p class="medium">Glemt adgangskode?</p>
          </div>
        </form>
      </div>
    </div>
  </div>     
</template>
