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
        v-if="edgeToAdd.type != null && edgeToAdd.type != 'DELETE'"
        class="manage-button"
        @click="addRelationship"
      >
        Add relationship
      </button>
      <button
        v-if="edgeToAdd.type != null && edgeToAdd.type == 'DELETE'"
        class="manage-button"
        @click="delRelationship"
      >
        Del. relationship
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
      <input
        v-if="editNode && !addNode && nodeToAdd.type != null"
        name="birthDate"
        id="birthDate"
        class="input"
        type="date"
        :value="nodeToAdd.birthDate"
        min="1800-01-01"
        max="2023-12-31"
        @change="(e) => (nodeToAdd.birthDate = e.target.value)"
      />
      <button v-if="!editNode" class="manage-button" @click="removePerson">
        Remove Person
      </button>
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
      v-model:selected-nodes="selectedNodes"
      v-model:selected-edges="selectedEdges"
      :configs="configs"
      :layouts="layout"
    >
      <!-- <template #edge-label="{ edge, ...slotProps }">
        <v-edge-label
          :text="edge.label"
          align="center"
          vertical-align="above"
          v-bind="slotProps"
        />
      </template> -->
      <template
        v-if="store.loggedUser && store.loggedUser._id == route.params.id"
        #override-node="slotProps"
      >
        <v-shape
          v-bind="slotProps"
          @click="customEventHandler(slotProps.nodeId, $event)"
        />
      </template>
    </v-network-graph>
    <div v-for="node in canClone">
      <div>{{ node.firstName }} {{ node.lastName }} {{ node.birthDate }}</div>
    </div>
    <button
      v-if="canClone.length > 0 && route.params.id !== user._id"
      @click="cloneTreeNodes"
    >
      Clone tree
    </button>
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
    selectable: true,
    normal: {
      color: "#00000096",
      width: 3,
    },
    margin: 4,
    marker: {
      target: {
        type: (edge) => (edge.type = "arrow"),
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
    selectable: 2,
    draggable: false,
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
      directionAutoAdjustment: true,
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
  birthDate: null,
});
const edgeToAdd = ref({
  type: null,
  from: null,
  to: null,
});
const selectedNodes = ref([]);
const selectedEdges = ref([]);
const canClone = ref([]);
const sameNodes = ref([]);
const generationDiff = ref(null);

async function addRelationship() {
  console.log(edgeToAdd.value);
  if (edgeToAdd.value.type == "IS_MOTHER")
    await axios
      .post(`http://localhost:5000/actors/addMother/${edgeToAdd.value.to}`, {
        parentId: edgeToAdd.value.from,
      })
      .then(() => formGraph());
  if (edgeToAdd.value.type == "IS_FATHER") {
    await axios
      .post(`http://localhost:5000/actors/addFather/${edgeToAdd.value.to}`, {
        parentId: edgeToAdd.value.from,
      })
      .then(() => formGraph());
  }
}

async function delRelationship() {
  axios
    .delete(`http://localhost:5000/actors/delRel`, {
      data: {
        parentId: edgeToAdd.value.from,
        childId: edgeToAdd.value.to,
      },
    })
    .then(() => formGraph());
}

function removePerson() {
  axios
    .delete(`http://localhost:5000/actors/${selectedNode.value.id}`)
    .then(() => formGraph());
}

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
      })
      .then((res) => {
        console.log(res.data);
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
  const selected = selectedNodes.value.reduce((prev, curr, index) => {
    return [...prev, treeNodes.value[curr]].sort(function (a, b) {
      return parseInt(a.generation) - parseInt(b.generation);
    });
  }, []);
  if (
    selected.length == 2 &&
    Math.abs(selected[0].generation - selected[1].generation) == 1
  ) {
    const edges = treeEdges.value.filter(
      (el) =>
        (el.from == selected[0].id || el.from == selected[1].id) &&
        (el.to == selected[0].id || el.to == selected[1].id)
    );
    edgeToAdd.value.from = selected[1].id;
    edgeToAdd.value.to = selected[0].id;
    if (edges.length > 0) {
      edgeToAdd.value.type = "DELETE";
    } else {
      selected[1].gender == "female"
        ? (edgeToAdd.value.type = "IS_MOTHER")
        : (edgeToAdd.value.type = "IS_FATHER");
    }
  } else {
    edgeToAdd.value = {
      type: null,
      from: null,
      to: null,
    };
  }
  // console.log(treeNodes.value[selectedNodes.value[0]]);
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

let edgesSet = [];

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
      return treeNodes.value.map((el) => el.id).indexOf(id);
    };
    const nodes = data.nodes
      .filter((node) => node.treeId === route.params.id)
      .map((el) => el.id);
    treeEdges.value = data.edges
      .map((el) => ({
        ...el,
        source: findNode(el.from),
        target: findNode(el.to),
        label: el.type.substring(3),
      }))
      .filter((node) => nodes.includes(node.from) || nodes.includes(node.to));

    const hasParent = (node) => {
      const dane = data.edges.filter(
        (edge) =>
          node.id == edge.to &&
          (edge.type == "IS_FATHER" || edge.type == "IS_MOTHER")
      );
      return dane.length > 0 ? dane[0].from : false;
    };
    function lastOfGen(list, gen) {
      const result = list
        .filter((el) => el.gen == gen)
        .sort((a, b) => (a.x > b.x ? -1 : 1));
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
    const loggedUserTree = store.loggedUser
      ? data.nodes.filter((el) => el.treeId == store.loggedUser._id)
      : [];
    // console.log(loggedUserTree);
    sameNodes.value = treeNodes.value.reduce(
      (prev, curr) => {
        let obj = loggedUserTree.find(
          (o) =>
            o.firstName === curr.firstName &&
            o.lastName === curr.lastName &&
            o.birthDate === curr.birthDate
        );
        if (obj == undefined) {
          return { ...prev, filtered: [...prev.filtered, curr] };
        } else {
          edgesSet.push({
            oldNode: curr.id,
            newNode: obj.id,
          });
          return { ...prev, same: [...prev.same, curr] };
        }
      },
      { same: [], filtered: [] }
    );
    canClone.value = sameNodes.value.same;
    const randSame = loggedUserTree.find(
      (o) =>
        o.firstName === sameNodes.value.same[0].firstName &&
        o.lastName === sameNodes.value.same[0].lastName &&
        o.birthDate === sameNodes.value.same[0].birthDate
    );
    generationDiff.value = randSame
      ? randSame.generation - sameNodes.value.same[0].generation
      : 0;
  });
}

async function cloneTreeNodes() {
  const sameIds = sameNodes.value.same.map((el) => el.id);
  const edgesToClone = treeEdges.value.filter(
    (el) => !(sameIds.includes(el.from) && sameIds.includes(el.to))
  );
  await sameNodes.value.filtered.reduce(async (prev, curr) => {
    const newNode = await axios
      .post("http://localhost:5000/actors/", {
        ...curr,
        generation: parseInt(curr.generation) + parseInt(generationDiff.value),
        treeId: store.loggedUser._id,
      })
      .then((res) => {
        return res.data;
      });
    edgesSet.push({
      oldNode: curr.id,
      newNode: newNode.id,
    });
  }, []);

  // console.log(edgesSet);
  edgesToClone.reduce(async (prev, curr) => {
    // console.log(curr);
    const newEdge = await axios
      .post(
        curr.type === "IS_FATHER"
          ? `http://localhost:5000/actors/addFather/${
              edgesSet.find((n) => n.oldNode == curr.to).newNode
            }`
          : `http://localhost:5000/actors/addMother/${
              edgesSet.find((n) => n.oldNode == curr.to).newNode
            }`,
        {
          parentId: edgesSet.find((n) => n.oldNode == curr.from).newNode,
        }
      )
      .then((res) => {
        return res.data;
      });
  }, []);
  alert("TREE CLONED");
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
