<template>
  <h2>User</h2>
  <div v-if="user" class="user-info-container">
    <div>ID: {{ user._id }}</div>
    <div class="user-info">
      Username:
      <input
        v-if="edit && canEdit"
        :value="user.username"
        @change="(e) => (user.username = e.target.value)"
      />
      <div v-else>{{ user.username }}</div>
    </div>
    <div class="user-info">
      Email:
      <input
        v-if="edit && canEdit"
        :value="user.email"
        @change="(e) => (user.email = e.target.value)"
      />
      <div v-else>{{ user.email }}</div>
    </div>
    <button v-if="canEdit !== false" @click="handleEdit">
      <div v-if="canEdit && !edit">Edit</div>
      <div v-if="edit">Confirm</div>
    </button>
    <button v-if="edit && canEdit" @click="edit = !edit">Cancel</button>
    <div>
      <h2>Tree</h2>
      <!-- <div v-for="node in treeNodes">
        <img
          v-if="node.gender == `Male`"
          class="node-img"
          :src="`https://randomuser.me/api/portraits/men/${
            Math.floor(Math.random() * 99) + 1
          }.jpg`"
        />
        <img
          v-else
          class="node-img"
          :src="`https://randomuser.me/api/portraits/women/${
            Math.floor(Math.random() * 99) + 1
          }.jpg`"
        />
        <div>{{ node.firstName }}</div>
        <div>{{ node.lastName }}</div>
      </div> -->
    </div>
    <v-network-graph
      v-if="treeNodes && treeEdges"
      :nodes="treeNodes"
      :edges="treeEdges"
      :configs="configs"
    />
    <!-- <v-network-graph
      :nodes="data.nodes"
      :edges="data.edges"
      :layouts="data.layouts"
      :zoom-level="3"
    /> -->
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watchEffect, onMounted } from "vue";
import { userStore } from "../store";
import * as vNG from "v-network-graph";
import data from "./data";

const configs = vNG.defineConfigs({
  // view: {
  //   layoutHandler: new vNG.GridLayout({ grid: 15 }),
  // },
  node: {
    label: {
      visible: true,
      fontFamily: undefined,
      fontSize: 11,
      lineHeight: 1.1,
      color: "#ffffff",
      margin: 4,
      direction: "south",
      text: "name",
    },
  },
});

const route = useRoute();
const store = userStore();
const user = ref(null);
const edit = ref(false);
const canEdit = ref(false);
const treeNodes = ref(null);
const treeEdges = ref(null);

onMounted(() => {
  store.getUsers().then((data) => {
    store.setStore(data);
    user.value = data.filter((user) => user._id === route.params.id)[0];
  });
  store.getTrees().then((data) => {
    console.log(data);
    store.setTrees(data);
    treeNodes.value = data.nodes
      .filter((node) => node.treeId === route.params.id)
      .map((el) => ({ ...el, name: `${el.firstName} \n${el.lastName}` }));
    treeEdges.value = data.edges.map((el) => ({
      ...el,
      source: el.from,
      target: el.to,
    }));
  });
});

watchEffect(() => {
  console.log(user.value);
  if (user.value !== null) {
    canEdit.value =
      store.loggedUser !== null
        ? store.loggedUser._id == user.value._id
        : false;
  }

  if (!canEdit) {
    edit.value = canEdit;
  }
});

const handleEdit = () => {
  if (edit.value == true) {
    store.editUser(user.value).then((res) => {
      if (res == true) {
      }
    });
  } else {
    edit.value = !edit.value;
  }
};
</script>

<style scoped>
.user-info {
  display: flex;
  gap: 5px;
}
.user-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-info-container > div,
button {
  margin: 7px;
}
.node-img {
  width: 70px;
  height: 70px;
  border: 2px solid white;
  border-radius: 90px;
}
.v-network-graph {
  width: 90vw;
  height: 60vh;
  border: 2px solid rgb(255, 255, 255);
}
</style>
