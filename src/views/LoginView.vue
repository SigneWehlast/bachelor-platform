<script setup>
</script>
<template>
    <div class="login">
        <div class="login__blank">
        </div>
        <div class="login__form">
            <h1>Log på CarAds platform</h1>
            <form class="login-form">
                <div class="login-form__group h3">
                    <label>Brugernavn</label>
                    <input type="username" required class="login-form__input">
                </div>
                <div class="login-form__group h3">
                    <label>Adgangskode</label>
                    <input type="password" required class="login-form__input">
                </div>
                <div class="login-form__group">
                    <button type="submit" class="login-form__btn">Login</button>
                    <p class="medium">Glemt adgangskode?</p>
                </div>
            </form>
        </div>
    </div>
</template>