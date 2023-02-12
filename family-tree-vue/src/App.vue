<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { userStore } from "./store";

const store = userStore();
onMounted(() => {
  store.getRooms();
  console.log("APP MOUNTED");
});
</script>

<style scoped></style>
