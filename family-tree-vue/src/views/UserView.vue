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
    <div id="tree" ref="tree"></div>
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
    </v-network-graph>
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

onMounted(() => {
  store.getUsers().then((data) => {
    store.setStore(data);
    user.value = data.filter((user) => user._id === route.params.id)[0];
  });
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
    findNode("3");
    treeEdges.value = data.edges.map((el) => ({
      ...el,
      source: findNode(el.from),
      target: findNode(el.to),
      label: el.type,
    }));
    const nodes = data.nodes.filter((node) => node.treeId === route.params.id);
    const hasParent = (node) => {
      const dane = data.edges.filter(
        (edge) =>
          node.id == edge.to && edge.type == ("IS_FATHER" || "IS_MOTHER")
      );
      return dane.length > 0 ? dane[0].from : false;
    };
    const hasPartner = (node) => {
      const dane = data.edges.filter(
        (edge) => node.id === (edge.to || edge.from) && edge.type === "PARTNER"
      );
      if (dane.length > 0) {
        return node.id === edge.to ? edge.from : edge.to;
      }
    };
    const setPosition = () => {
      let positions = nodes.reduce((prev, curr, index) => {
        if (hasParent(curr)) {
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
              x: 0,
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
      // console.log(data.edges);
      // console.log(data.edges.reverse());
      // console.log(positions);
    };
    setPosition();
    // layout.value = {
    //   nodes: {
    //     ...data.nodes
    //       .filter((node) => node.treeId === route.params.id)
    //       .map((el) => ({
    //         x: -el.generation * 50 + Math.floor(Math.random() * 5) * 150,
    //         y: -el.generation * 150,
    //       })),
    //   },
    // };
  });
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
