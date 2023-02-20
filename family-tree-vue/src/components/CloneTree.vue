<template>
  <div class="form-background" @click="$emit('cloneTreeView')"></div>
  <div class="users-container">
    <div class="user" v-for="user in users">
      <div>{{ user.firstName }} {{ user.lastName }}</div>
      <div>{{ user.birthDate }}</div>
      <button
        @click="
          cloneTree(user.id, store.focusedPerson.id, user.treeId);
          $emit('cloneTreeView');
        "
      >
        SELECT
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { userStore } from "../store";

const store = userStore();
defineProps({
  users: Array,
});
const emits = defineEmits(["cloneTreeView", "cloneNode"]);

async function cloneTree(to, from, treeId) {
  console.log(treeId);
  await axios.post(`http://localhost:5000/actors/cloneSubgraph/${to}`, {
    id: from,
    treeId: treeId,
  });
  this.refreshTrees();
}
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px;
  background: rgb(82, 82, 82);
  width: auto;
  min-width: 300px;
  z-index: 2;
}
.form-background {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(43, 43, 43, 0.589);
  width: 100%;
  height: 100%;
  z-index: 0;
}
.users-container {
  background-color: rgb(32, 32, 32);
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
