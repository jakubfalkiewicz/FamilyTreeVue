<script setup>
import { onMounted } from "vue";
import { userStore } from "../store";

const store = userStore();

onMounted(() => {
  store.getUsers().then((data) => {
    store.setStore(data);
  });
  store.getTrees().then((data) => {
    console.log(data);
    store.setTrees(data);
  });
});
</script>

<template>
  <div v-if="store.loggedUser">Logged as: {{ store.loggedUser.username }}</div>
  <h1>Home</h1>
  <div
    v-for="post in store.usersList"
    class="user"
    @click="this.$router.push(`/users/${post._id}`)"
  >
    <div>{{ post.username }}</div>
    <div>{{ post.email }}</div>
  </div>
</template>

<style scoped>
.user {
  border: 1px solid white;
  border-radius: 15px;
  padding: 7px;
  margin: 10px;
}
</style>
