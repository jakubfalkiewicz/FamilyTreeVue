<template>
  <div class="add-person-form" v-if="peopleListView">
    <div
      class="form-background"
      @click="
        $emit('peopleListView');
        peopleListView = !peopleListView;
        nodeToAdd = {};
      "
    ></div>
    <div class="form-container" v-for="user in users">
      <div>{{ user.firstName }} {{ user.lastName }}</div>
      <div>{{ user.birthDate }}</div>
      <button
        v-if="!selectAncestor"
        class="green-button"
        @click.prevent="
          $emit('setDefault', user.id);
          peopleListView = !peopleListView;
        "
      >
        SET DEFAULT
      </button>
      <button
        v-if="!selectAncestor"
        class="yellow-button"
        @click="
          $emit('detach', user.id, store.focusedPerson.id);
          $emit('peopleListView');
        "
      >
        DETACH
      </button>
      <button v-if="selectAncestor" class="green-button">SELECT</button>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "../store";
const store = userStore();
defineProps({
  users: Array,
  peopleListView: Boolean,
  nodeToAdd: Object,
  selectAncestor: Boolean,
});
const emits = defineEmits(["setDefault", "peopleListView", "detach"]);
</script>

<style lang="scss" scoped>
.green-button {
  background-color: green;
}
.yellow-button {
  background-color: yellow;
  color: black;
}
.red-button {
  background-color: red;
}
.add-person-form {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.form-container {
  background-color: rgb(32, 32, 32);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
}
.form-background {
  position: fixed;
  background-color: rgba(43, 43, 43, 0.589);
  width: 100%;
  height: 100%;
}
</style>
