<template>
  <div class="add-person-form" v-if="selectPersonView">
    <div
      class="form-background-select"
      @click="
        $emit('selectPersonView');
        selectPersonView = !selectPersonView;
      "
    ></div>
    <div class="form-container" v-for="user in users">
      <div>{{ user.firstName }} {{ user.lastName }}</div>
      <div>{{ user.birthDate }}</div>
      <button
        class="green-button"
        v-if="
          new Date(user.birthDate) < new Date(store.focusedPerson.birthDate)
        "
        @click="
          addParent(user.id, user.gender);
          $emit('selectPersonView');
        "
      >
        SELECT PARENT
      </button>
      <button
        class="green-button"
        v-else
        @click="
          addKid(user.id, store.focusedPerson.gender);
          $emit('selectPersonView');
        "
      >
        SELECT KID
      </button>
    </div>
    <div v-if="!users">NO RESULTS</div>
  </div>
</template>

<script setup>
import axios from "axios";
import { userStore } from "../store";

const store = userStore();

defineProps({
  users: Array,
  selectPersonView: Boolean,
  nodeToAdd: Object,
});
const emits = defineEmits(["selectPersonView"]);
async function addParent(id, gender) {
  await axios.post(
    `http://localhost:5000/actors/${
      gender === "male" ? "addFather" : "addMother"
    }/${store.focusedPerson.id}`,
    { parentId: id }
  );
  store.refreshTrees();
}
async function addKid(id, gender) {
  await axios.post(
    `http://localhost:5000/actors/${
      gender === "male" ? "addFather" : "addMother"
    }/${id}`,
    { parentId: store.focusedPerson.id }
  );
  store.refreshTrees();
}
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
.form-background-select {
  position: fixed;
  background-color: rgba(43, 43, 43, 0.589);
  width: 100%;
  height: 100%;
}
</style>
