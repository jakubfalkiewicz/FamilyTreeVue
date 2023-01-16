<template>
  <nav>
    <div v-if="store.loggedUser !== null">
      <router-link class="link" to="/">Home</router-link> |
      <button
        class="nav-logout"
        v-if="store.loggedUser !== null"
        @click="store.logoutUser"
      >
        Logout
      </button>
    </div>
    <div v-else>
      <router-link class="link" to="/">Home</router-link> |
      <router-link class="link" to="/register">Register</router-link> |
      <router-link class="link" to="/login">Login</router-link>
    </div>
  </nav>
  <router-view />
</template>

<script setup>
import { RouterView, RouterLink } from "vue-router";
import { userStore } from "./store";

const store = userStore();
</script>

<style scoped>

</style>
