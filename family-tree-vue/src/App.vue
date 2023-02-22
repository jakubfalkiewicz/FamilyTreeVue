<template>
  <div v-if="route.params.id">
    <router-link class="link" to="/">Home</router-link> |
    <router-link class="link" to="/chat/public">Chat</router-link>
  </div>

  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import { userStore } from "./store";

const store = userStore();
const route = useRoute();
onMounted(() => {
  // store.getRooms();
  console.log("APP MOUNTED");
});
</script>

<style scoped></style>
