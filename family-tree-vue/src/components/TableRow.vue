<template>
  <div>
    {{ user.firstName }}
    {{ user.lastName }}
  </div>
  <div @click="store.setFocus(user.id)">
    {{ user.birthDate }} <button>Focus</button>
  </div>
</template>

<script setup>
import { userStore } from "../store";
const store = userStore();

defineProps({
  user: Object,
});
</script>

<style lang="scss" scoped></style>
