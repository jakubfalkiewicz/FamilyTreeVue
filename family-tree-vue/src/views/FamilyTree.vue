<!-- <template>
  <div id="tree" ref="tree"></div>
</template>

<script setup>
import FamilyTree from "@balkangraph/familytree.js";
import { useRoute } from "vue-router";
import { ref, watchEffect, onMounted } from "vue";
import { userStore } from "../store";
const route = useRoute();
const store = userStore();
const user = ref(null);
const tree = ref(null);
const treeNodes = ref([]);
const nodes = [
  {
    id: 1,
    pids: [2],
    name: "Amber McKenzie",
    gender: "female",
    img: "https://cdn.balkan.app/shared/2.jpg",
  },
  {
    id: 2,
    pids: [1, 6],
    name: "Ava Field",
    gender: "male",
    img: "https://cdn.balkan.app/shared/m30/5.jpg",
  },
  {
    id: 3,
    mid: 1,
    fid: 2,
    name: "Peter Stevens",
    gender: "male",
    img: "https://cdn.balkan.app/shared/m10/2.jpg",
  },
  {
    id: 4,
    mid: 1,
    fid: 2,
    name: "Savin Stevens",
    gender: "male",
    img: "https://cdn.balkan.app/shared/m10/1.jpg",
  },
  {
    id: 5,
    mid: 1,
    fid: 2,
    name: "Emma Stevens",
    gender: "female",
    img: "https://cdn.balkan.app/shared/w10/3.jpg",
  },
];
const family = ref(null);

const mytree = (domEl, x) => {
  family.value = new FamilyTree(domEl, {
    nodes: x,
    nodeBinding: {
      field_0: "name",
    },
  });
};

onMounted(() => {
  store.getUsers().then((data) => {
    store.setStore(data);
    user.value = data.filter((user) => user._id === route.params.id)[0];
  });
  store.getTrees().then((data) => {
    console.log(
      data.nodes.map((el) => ({
        ...el,
        name: `${el.firstName} ${el.lastName}`,
        color: el.gender === "male" ? "lightskyblue" : "hotpink",
      }))
    );
    store.setTrees(data);
    treeNodes.value = data.nodes
      .filter((node) => node.treeId === route.params.id)
      .map((el) => ({
        ...el,
        name: `${el.firstName} \n${el.lastName}`,
        color: el.gender === "male" ? "lightskyblue" : "hotpink",
        id: parseInt(el.id),
      }));
    console.log(nodes);
    mytree(tree.value, nodes.value);
  });
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#tree {
  width: 100vw;
  height: 100%;
}
</style> -->
<template>
  <div id="tree" ref="tree"></div>
</template>

<script>
import FamilyTree from "@balkangraph/familytree.js";
import { userStore } from "../store";

export default {
  name: "tree",
  data() {
    return {
      nodes: [
        {
          id: 1,
          pids: [2],
          name: "Amber McKenzie",
          gender: "female",
          img: "https://cdn.balkan.app/shared/2.jpg",
        },
        {
          id: 2,
          pids: [1],
          name: "Ava Field",
          gender: "male",
          img: "https://cdn.balkan.app/shared/m30/5.jpg",
        },
        {
          id: 3,
          mid: 1,
          fid: 2,
          name: "Peter Stevens",
          gender: "male",
          img: "https://cdn.balkan.app/shared/m10/2.jpg",
        },
        {
          id: 4,
          mid: 1,
          fid: 2,
          name: "Savin Stevens",
          gender: "male",
          img: "https://cdn.balkan.app/shared/m10/1.jpg",
        },
        {
          id: 5,
          mid: 1,
          fid: 2,
          name: "Emma Stevens",
          gender: "female",
          img: "https://cdn.balkan.app/shared/w10/3.jpg",
        },
      ],
      treeNodes: [],
    };
  },

  methods: {
    mytree: function (domEl, x) {
      this.family = new FamilyTree(domEl, {
        nodes: x,
        nodeBinding: {
          field_0: "name",
          img_0: "img",
        },
      });
    },
  },

  mounted() {
    const store = userStore();
    store.getTrees().then((data) => {
      console.log(data);
      store.setTrees(data);
      this.treeNodes = data.nodes.map((el) => ({
        ...el,
        name: `${el.firstName} \n${el.lastName}`,
        color: el.gender === "Male" ? "lightskyblue" : "hotpink",
      }));
    });
    console.log(this.treeNodes);
    this.mytree(this.$refs.tree, this.treeNodes);
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#tree {
  width: 100vw;
  height: 100%;
}
</style>
