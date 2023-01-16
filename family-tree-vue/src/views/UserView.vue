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
      <button
        v-if="addNode"
        class="manage-button"
        @click="
          {
            nodeToAdd.type = 'parent';
            addNode = !addNode;
          }
        "
      >
        Parent
      </button>
      <input
        v-if="editNode && !addNode && nodeToAdd.type != null"
        placeholder="First Name"
        class="input"
        :value="nodeToAdd.firstName"
        @change="(e) => (nodeToAdd.firstName = e.target.value)"
      />
      <button
        v-if="!editNode"
        @click="editNode = !editNode"
        class="manage-button"
      >
        Edit Person
      </button>
      <button
        v-if="addNode"
        class="manage-button"
        @click="
          {
            nodeToAdd.type = 'child';
            addNode = !addNode;
          }
        "
      >
        Child
      </button>
      <input
        v-if="editNode && !addNode && nodeToAdd.type != null"
        placeholder="Last Name"
        class="input"
        :value="nodeToAdd.lastName"
        @change="(e) => (nodeToAdd.lastName = e.target.value)"
      />
      <select
        v-if="editNode && !addNode && nodeToAdd.type != null"
        name="gender"
        id="gender"
        class="input"
        @change="(e) => (nodeToAdd.gender = e.target.value)"
      >
        <option disabled selected value>----- select gender -----</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button v-if="!editNode" class="manage-button">Remove Person</button>
      <!-- <button v-if="addNode" class="manage-button">Partner</button> -->
      <input
        type="text"
        class="input"
        v-if="editNode && !addNode && nodeToAdd.type == null"
        :value="selectedNode.firstName"
        placeholder="First name"
        @change="(e) => (selectedNode.firstName = e.target.value)"
      />
      <input
        type="text"
        class="input"
        v-if="editNode && !addNode && nodeToAdd.type == null"
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
  view: {
    // scalingObjects: true,
  },
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
const nodeToAdd = ref({
  type: null,
  firstName: null,
  lastName: null,
  gender: null,
});

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
  if (nodeToAdd.value.type != null) nodeToAdd.value.type = null;
  if (editNode.value == true) editNode.value = !editNode.value;
  if (addNode.value == true) addNode.value = !addNode.value;
  manageNode.value = "none";
}

async function handleEditNode() {
  if (nodeToAdd.value.type != null) {
    await axios
      .post(`http://localhost:5000/actors/`, {
        ...nodeToAdd.value,
        generation:
          nodeToAdd.value.type == "child"
            ? parseInt(selectedNode.value.generation) - 1
            : parseInt(selectedNode.value.generation) + 1,
        treeId: user.value._id,
        birthDate: "Unknown",
      })
      .then((res) => {
        console.log(selectedNode.value.gender);
        if (nodeToAdd.value.type == "child") {
          axios
            .post(
              selectedNode.value.gender == "male"
                ? `http://localhost:5000/actors/addFather/${res.data.id}`
                : `http://localhost:5000/actors/addMother/${res.data.id}`,
              { parentId: selectedNode.value.id }
            )
            .then(() => formGraph());
        } else {
          axios
            .post(
              res.data.gender == "male"
                ? `http://localhost:5000/actors/addFather/${selectedNode.value.id}`
                : `http://localhost:5000/actors/addMother/${selectedNode.value.id}`,
              { parentId: res.data.id }
            )
            .then(() => formGraph());
        }
      });
  } else {
    axios
      .put(
        `http://localhost:5000/actors/${selectedNode.value.id}`,
        selectedNode.value
      )
      .then(() => formGraph());
  }
  editNode.value = !editNode.value;
}

function handleCancelEditNode() {
  console.log(nodeToAdd.value);
  formGraph();
  editNode.value = !editNode.value;
  if (addNode.value == true) addNode.value = !addNode.value;
  nodeToAdd.value.type = null;
  nodeToAdd.value.firstName = null;
  nodeToAdd.value.lastName = null;
}

function customEventHandler(nodeId, event) {
  selectedNode.value = treeNodes.value[nodeId];
  console.log(selectedNode.value);
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
  }
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
    treeEdges.value = data.edges
      .filter((edge) => edge.type !== "PARTNER")
      .map((el) => ({
        ...el,
        source: findNode(el.from),
        target: findNode(el.to),
        label: el.type.substring(3),
      }));
    const nodes = data.nodes.filter((node) => node.treeId === route.params.id);
    const hasParent = (node) => {
      // console.log("NODEID: " + findNode(node.id));
      const dane = data.edges.filter(
        (edge) =>
          node.id == edge.to &&
          (edge.type == "IS_FATHER" || edge.type == "IS_MOTHER")
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
    function lastOfGen(list, gen) {
      const result = list
        .filter((el) => el.gen == gen)
        .sort((a, b) => (a.x > b.x ? -1 : 1));
      console.log(result);
      return result.length > 0 ? result[0].x + 100 : 0;
    }
    function setPosition() {
      let positions = treeNodes.value.reduce((prev, curr, index) => {
        if (hasParent(curr)) {
          return [
            ...prev,
            {
              id: curr.id,
              gen: curr.generation,
              x: lastOfGen(prev, curr.generation),
              y: curr.generation * -150,
            },
          ];
        } else {
          return [
            ...prev,
            {
              id: curr.id,
              gen: curr.generation,
              x: lastOfGen(prev, curr.generation),
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
