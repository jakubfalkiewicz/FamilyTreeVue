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
    <button v-if="edit && canEdit" @click="handleCancelEdit">Cancel</button>
    <div>
      <h2>Tree</h2>
    </div>
    <div
      class="manageNode"
      :style="{
        display: manageNode,
        top: heightDist + 'px',
        left: widthDist + 'px',
      }"
    >
      <div class="manage-nav">
        <div>Manage</div>
        <button class="cancel" @click="hideManageNode">X</button>
      </div>
      <button
        v-if="!editNode"
        class="manage-button"
        @click="
          {
            addNode = !addNode;
            editNode = !editNode;
          }
        "
      >
        Add Related
      </button>
      <button v-if="addNode" class="manage-button">Parent</button>
      <button
        v-if="!editNode"
        @click="editNode = !editNode"
        class="manage-button"
      >
        Edit Person
      </button>
      <button v-if="addNode" class="manage-button">Child</button>
      <button v-if="!editNode" class="manage-button">Remove Person</button>
      <button v-if="addNode" class="manage-button">Partner</button>
      <input
        type="text"
        class="input"
        v-if="editNode && !addNode"
        :value="selectedNode.firstName"
        placeholder="First name"
        @change="(e) => (selectedNode.firstName = e.target.value)"
      />
      <input
        type="text"
        class="input"
        v-if="editNode && !addNode"
        :value="selectedNode.lastName"
        placeholder="Last name"
        @change="(e) => (selectedNode.lastName = e.target.value)"
      />
      <div v-if="editNode">
        <button @click="handleEditNode">Confirm</button>
        <button @click="handleCancelEditNode">Cancel</button>
      </div>
    </div>
    <v-network-graph
      v-if="treeNodes && treeEdges && layout"
      :nodes="treeNodes"
      :edges="treeEdges"
      :configs="configs"
      :layouts="layout"
    >
      <template #edge-label="{ edge, ...slotProps }">
        <v-edge-label
          :text="edge.label"
          align="center"
          vertical-align="above"
          v-bind="slotProps"
        />
      </template>
      <template #override-node="slotProps">
        <v-shape
          v-bind="slotProps"
          @click="customEventHandler(slotProps.nodeId, $event)"
        />
      </template>
    </v-network-graph>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watchEffect, onMounted } from "vue";
import { userStore } from "../store";
import * as vNG from "v-network-graph";
import axios from "axios";

const configs = vNG.defineConfigs({
  edge: {
    normal: {
      color: "#00000096",
      width: 3,
    },
    margin: 4,
    marker: {
      target: {
        type: (edge) => (edge.type == "PARTNER" ? "none" : "arrow"),
        width: 4,
        height: 4,
      },
    },
    label: {
      visible: true,
      color: "#fff",
    },
  },
  node: {
    normal: {
      type: "circle",
      color: (node) => node.color,
    },
    label: {
      visible: true,
      fontFamily: "sans-serif",
      fontSize: 11,
      lineHeight: 1.1,
      color: "#fff",
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
const layout = ref(null);
const heightDist = ref(null);
const widthDist = ref(null);
const manageNode = ref("none");
const selectedNode = ref(null);
const editNode = ref(false);
const addNode = ref(false);

function handleEdit() {
  if (edit.value == true) {
    store.editUser(user.value).then((res) => {
      if (res == true) {
      }
    });
  } else {
    edit.value = !edit.value;
  }
}

function handleCancelEdit() {
  store.getUsers().then((data) => {
    store.setStore(data);
    user.value = data.filter((user) => user._id === route.params.id)[0];
  });
  edit.value = !edit.value;
}

function hideManageNode() {
  manageNode.value = "none";
}

function handleEditNode() {
  editNode.value = !editNode.value;
  axios
    .put(
      `http://localhost:5000/actors/${selectedNode.value.id}`,
      selectedNode.value
    )
    .then(() => formGraph());
}

function handleCancelEditNode() {
  formGraph();
  editNode.value = !editNode.value;
  addNode.value = !addNode.value;
}

function customEventHandler(nodeId, event) {
  selectedNode.value = treeNodes.value[nodeId];
  const eventInfo = {
    idIndex: parseInt(nodeId),
    type: event.type,
    x: event.clientX,
    y: event.clientY,
  };
  if (event.type == "click") {
    heightDist.value = event.clientY;
    widthDist.value = event.clientX;
    manageNode.value = "none"
      ? (manageNode.value = "flex")
      : (manageNode.value = "none");
    console.log(manageNode.value);
  }
  console.log(treeNodes.value[nodeId]);
}

function formGraph() {
  store.getTrees().then((data) => {
    store.setTrees(data);
    treeNodes.value = data.nodes
      .filter((node) => node.treeId === route.params.id)
      .map((el) => ({
        ...el,
        name: `${el.firstName} \n${el.lastName}`,
        color: el.gender === "male" ? "lightskyblue" : "hotpink",
      }));
    const findNode = (id) => {
      return data.nodes.map((el) => el.id).indexOf(id);
    };
    treeEdges.value = data.edges.map((el) => ({
      ...el,
      source: findNode(el.from),
      target: findNode(el.to),
      label: el.type,
    }));
    const nodes = data.nodes.filter((node) => node.treeId === route.params.id);
    const hasParent = (node) => {
      // console.log("NODEID: " + findNode(node.id));
      const dane = data.edges.filter(
        (edge) =>
          node.id == edge.to && edge.type == ("IS_FATHER" || "IS_MOTHER")
      );
      return dane.length > 0 ? dane[0].from : false;
    };
    function hasPartner(node) {
      const dane = data.edges.filter(
        (edge) => node.id === (edge.to || edge.from) && edge.type === "PARTNER"
      );
      if (dane.length > 0) {
        return node.id === edge.to ? edge.from : edge.to;
      }
    }
    function setPosition() {
      let positions = nodes.reduce((prev, curr, index) => {
        // console.log(prev.length > 0 ? prev[index - 1].x : "");
        if (hasParent(curr)) {
          // console.log("CURR ID: " + curr.id);
          // console.log("PARENT ID: " + hasParent(curr));
          return [
            ...prev,
            {
              id: curr.id,
              gen: curr.generation,
              x: prev[index - 1].x - 100,
              y: curr.generation * -150,
            },
          ];
        } else {
          return [
            ...prev,
            {
              id: curr.id,
              gen: curr.generation,
              x: 100 * prev.length,
              y: curr.generation * -150,
            },
          ];
        }
      }, []);
      layout.value = {
        nodes: {
          ...positions,
        },
      };
    }
    setPosition();
  });
}

onMounted(() => {
  store.getUsers().then((data) => {
    store.setStore(data);
    user.value = data.filter((user) => user._id === route.params.id)[0];
  });
  formGraph();
});

watchEffect(() => {
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
</script>

<style scoped>
.manage-button {
  margin: 0 5px 0 5px;
}
.input {
  width: 90%;
  align-self: center;
}
.cancel {
  padding: 0 5px 0 5px;
  margin: 0px;
}
.manage-nav {
  display: flex;
  justify-content: space-between;
  margin: 0 7px 0 7px;
}
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
.manageNode {
  z-index: 1;
  border: 2px solid white;
  background-color: black;
  border-radius: 5px;
  padding: 5px;
  position: fixed;
  gap: 5px;
  /* bottom: 300px;
  left: 50%; */
  flex-direction: column;
}
</style>
