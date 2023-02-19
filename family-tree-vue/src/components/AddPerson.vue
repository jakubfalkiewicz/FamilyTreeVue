<template>
  <div class="add-person-form" v-if="addPersonView">
    <div
      class="form-background"
      @click="
        $emit('addPersonView');
        showList = !showList;
        addPersonView = !addPersonView;
        nodeToAdd = {};
      "
    ></div>
    <div class="form-container">
      <h2>Add ancestor</h2>
      <input
        placeholder="First Name"
        class="input"
        :value="nodeToAdd.firstName"
        @change="(e) => (nodeToAdd.firstName = e.target.value)"
      />
      <input
        placeholder="Last Name"
        class="input"
        :value="nodeToAdd.lastName"
        @change="(e) => (nodeToAdd.lastName = e.target.value)"
      />
      <select
        v-if="!nodeToAdd.gender"
        name="gender"
        id="gender"
        class="input"
        @change="(e) => (nodeToAdd.gender = e.target.value)"
      >
        <option disabled selected value>----- select gender -----</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        name="birthDate"
        id="birthDate"
        class="input"
        type="date"
        :value="nodeToAdd.birthDate"
        min="1000-01-01"
        max="2023-12-31"
        @change="(e) => (nodeToAdd.birthDate = e.target.value)"
      />
      <div class="form-buttons">
        <button
          @click="
            $emit('addPersonView');
            addPersonView = !addPersonView;
            nodeToAdd = {};
          "
        >
          CANCEL
        </button>
        <button @click="$emit('addPerson')">CONFIRM</button>
      </div>
      <button
        @click="
          $emit('selectPersonView');
          selectPersonView = !selectPersonView;
          addPersonView = !addPersonView;
        "
      >
        SELECT FROM LIST
      </button>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "../store";
import { useRoute } from "vue-router";

const route = useRoute();
const store = userStore();

defineProps({
  selectPersonView: Boolean,
  addPersonView: Boolean,
  nodeToAdd: Object,
});
const emits = defineEmits(["addPersonView", "addPerson", "selectPersonView"]);
</script>

<style lang="scss" scoped>
.form-buttons {
  display: flex;
  gap: 5px;
  width: 100%;
  > :nth-child(1) {
    background-color: red;
  }
  > :nth-child(2) {
    background-color: green;
  }
  button {
    font-weight: 600;
    width: 100%;
  }
}
.input {
  width: 250px;
  align-self: center;
  font-size: 18px;
  padding: 5px;
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
}
.form-container {
  background-color: rgb(32, 32, 32);
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
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
