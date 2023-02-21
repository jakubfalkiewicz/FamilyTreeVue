<template>
  <CloneTree
    v-if="cloneTreeView"
    :users="cloneList"
    @cloneTreeView="cloneTreeView = !cloneTreeView"
    @cloneTree="cloneTree"
  >
  </CloneTree>
  <SelectPerson
    :users="usersList"
    :selectPersonView="selectPersonView"
    :nodeToAdd="nodeToAdd"
    @selectPersonView="selectPersonView = !selectPersonView"
    @updateTable="updateTable"
  />
  <AddPerson
    :addPersonView="addPersonView"
    :nodeToAdd="nodeToAdd"
    @addPersonView="addPersonView = !addPersonView"
    @addPerson="addPerson"
    @selectPersonView="
      selectPersonView = !selectPersonView;
      addPersonView = !addPersonView;
      nodeToAdd = {};
    "
  />
  <PeopleList
    v-if="parentsList"
    :users="parentsList"
    @peopleListView="peopleListView = !peopleListView"
    @updateTable="updateTable"
    @setDefault="setDefault"
    @detach="detach"
    :peopleListView="peopleListView"
    :nodeToAdd="nodeToAdd"
    :select-ancestor="false"
  />
  <div
    class="link"
    v-if="route.params.id !== loggedUser._id"
    @click="this.$router.push(`/chat/${route.params.id}`)"
  >
    Private Chat
  </div>
  <div v-if="focusedPerson">
    <h2 :style="{ margin: 5 + 'px' }">
      {{ focusedPerson.firstName }} {{ focusedPerson.lastName }}
    </h2>
    <div>{{ focusedPerson.birthDate }}</div>
    <button v-if="!isOwner" @click="cloneTreeView = !cloneTreeView">
      CLONE TREE
    </button>
  </div>
  <div class="table-container" v-if="focusedPerson">
    <div class="table-column">
      <div class="table-row-1">
        <div v-if="store.hasFather(focusedPerson.id)">
          <TableRow :user="store.hasFather(focusedPerson.id)" />
          <div class="parent-buttons" v-if="isOwner">
            <button
              @click="
                nodeToAdd.type = 'addFather';
                nodeToAdd.gender = 'male';
                addPersonView = !addPersonView;
                setList();
              "
            >
              ADD
            </button>
            <button
              v-if="store.hasAnyFather(focusedPerson.id).length > 1"
              @click="getParents('fathers')"
            >
              CHANGE DEFAULT
            </button>
            <button
              @click="
                detach(store.hasFather(focusedPerson.id).id, focusedPerson.id)
              "
            >
              DETACH
            </button>
          </div>
        </div>
        <div v-else-if="store.hasAnyFather(focusedPerson.id).length > 0">
          <button @click="getParents2(store.hasAnyFather(focusedPerson.id))">
            SET DEFAULT
          </button>
        </div>
        <div v-else>
          <div
            v-if="isOwner"
            class="add-ancestor"
            @click="
              nodeToAdd.type = 'addFather';
              nodeToAdd.gender = 'male';
              addPersonView = !addPersonView;
              setList();
            "
          >
            +
          </div>
        </div>
      </div>
      <div class="table-row-1">
        <div v-if="store.hasMother(focusedPerson.id)">
          <TableRow :user="store.hasMother(focusedPerson.id)" />
          <div class="parent-buttons" v-if="isOwner">
            <button
              @click="
                nodeToAdd.type = 'addMother';
                nodeToAdd.gender = 'female';
                addPersonView = !addPersonView;
                setList();
              "
            >
              ADD
            </button>
            <button
              v-if="store.hasAnyMother(focusedPerson.id).length > 1"
              @click="getParents('mothers')"
            >
              CHANGE DEFAULT
            </button>
            <button
              @click="
                detach(store.hasMother(focusedPerson.id).id, focusedPerson.id)
              "
            >
              DETACH
            </button>
          </div>
        </div>
        <div v-else-if="store.hasAnyMother(focusedPerson.id).length > 0">
          <button @click="getParents2(store.hasAnyMother(focusedPerson.id))">
            SET DEFAULT
          </button>
        </div>
        <div v-else>
          <div
            v-if="isOwner"
            class="add-ancestor"
            @click="
              nodeToAdd.type = 'addMother';
              nodeToAdd.gender = 'female';
              addPersonView = !addPersonView;
              setList();
            "
          >
            +
          </div>
        </div>
      </div>
    </div>
    <div class="table-column">
      <div class="table-row-2">
        <div v-if="store.hasFather(store.hasFather(focusedPerson.id)?.id)">
          <TableRow
            :user="store.hasFather(store.hasFather(focusedPerson.id)?.id)"
          />
        </div>
      </div>
      <div class="table-row-2">
        <div v-if="store.hasMother(store.hasFather(focusedPerson.id)?.id)">
          <TableRow
            :user="store.hasMother(store.hasFather(focusedPerson.id)?.id)"
          />
        </div>
      </div>
      <div class="table-row-2">
        <div v-if="store.hasFather(store.hasMother(focusedPerson.id)?.id)">
          <TableRow
            :user="store.hasFather(store.hasMother(focusedPerson.id)?.id)"
          />
        </div>
      </div>
      <div class="table-row-2">
        <div v-if="store.hasMother(store.hasMother(focusedPerson.id)?.id)">
          <TableRow
            :user="store.hasMother(store.hasMother(focusedPerson.id)?.id)"
          />
        </div>
      </div>
    </div>
    <div class="table-column">
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasFather(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasFather(
                store.hasFather(store.hasFather(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasFather(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasMother(
                store.hasFather(store.hasFather(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasMother(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasFather(
                store.hasMother(store.hasFather(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasMother(store.hasFather(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasMother(
                store.hasMother(store.hasFather(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasFather(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasFather(
                store.hasFather(store.hasMother(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasFather(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasMother(
                store.hasFather(store.hasMother(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasFather(
              store.hasMother(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasFather(
                store.hasMother(store.hasMother(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
      <div class="table-row-3">
        <div
          v-if="
            store.hasMother(
              store.hasMother(store.hasMother(focusedPerson.id)?.id)?.id
            )
          "
        >
          <TableRow
            :user="
              store.hasMother(
                store.hasMother(store.hasMother(focusedPerson.id)?.id)?.id
              )
            "
          />
        </div>
      </div>
    </div>
  </div>
  <div class="kids-search-siblings">
    <div class="kids-container" v-if="focusedPerson">
      <div>
        <h2>Children</h2>
        <button
          v-if="isOwner"
          @click="
            nodeToAdd = {};
            addPersonView = !addPersonView;
            setList();
          "
        >
          +
        </button>
      </div>

      <div
        v-if="store.getKids(focusedPerson.id)"
        v-for="kid in store.getKids(focusedPerson.id)"
      >
        <div>{{ kid.firstName }} {{ kid.lastName }}</div>
        <div>{{ kid.birthDate }}</div>
        <button @click="setFocus(kid.id)">FOCUS</button>
      </div>
    </div>
    <div>
      <div class="home">
        <div :style="{ marginTop: 10 + 'px' }">Find tree member</div>
        <input
          type="text"
          :value="search"
          class="searchbar"
          placeholder="Search by name, surname"
          @change="(e) => (search = e.target.value)"
        />
      </div>
      <div class="tree-person-list">
        <div
          v-if="
            store.treesList?.nodes.filter(
              (e) => e.treeID === route.params.id
            ) !== null
          "
          v-for="person in store.treesList?.nodes
            .filter((e) => e.treeId === route.params.id)
            .filter((n) => n.id !== focusedPerson?.id)
            .filter((p) =>
              `${p.firstName.toLowerCase()}${p.lastName.toLowerCase()}`.includes(
                search.toLowerCase()
              )
            )"
          class="user"
          @click="this.$router.push(`/users/${person.treeId}`)"
          :style="{
            border: 2 + 'px',
            borderStyle: 'solid',
            borderColor: person.gender == 'male' ? 'lightskyblue' : 'hotpink',
          }"
        >
          <div class="user-row">
            <div>{{ person.firstName }} {{ person.lastName }}</div>
            <div>{{ person.birthDate }}</div>
          </div>
          <div class="user-row">
            <button @click="setFocus(person.id)">FOCUS</button>
            <button v-if="isOwner" @click="delNode(person.id)">DELETE</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watchEffect, onMounted, watch } from "vue";
import { userStore } from "../store";
import { storeToRefs } from "pinia";
import axios from "axios";
import TableRow from "./TableRow.vue";
import PeopleList from "./PeopleList.vue";
import AddPerson from "./AddPerson.vue";
import SelectPerson from "./SelectPerson.vue";
import CloneTree from "./CloneTree.vue";

const route = useRoute();
const store = userStore();

const search = ref("");
const addPersonView = ref(false);
const peopleListView = ref(false);
const selectPersonView = ref(false);
const cloneTreeView = ref(false);
const nodeToAdd = ref({
  type: null,
  firstName: null,
  lastName: null,
  gender: null,
  birthDate: null,
});
const parentsList = ref(null);
const usersList = ref(null);
const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
const isOwner = ref(loggedUser._id === route.params.id);
const cloneList = ref(null);

function detach(parent, child) {
  store.delRel(parent, child);
}

function delNode(nodeId) {
  store.delNode(nodeId);
}

function cloneTree(from, to) {
  store.cloneTree(from, to);
}
async function setList() {
  usersList.value = await axios
    .post(
      `http://localhost:5000/actors/potentialAncestors/${store.focusedPerson.id}`,
      { gender: nodeToAdd.value.gender }
    )
    .then((res) => {
      return res.data
        .filter(
          (e) =>
            !store.treesList.edges.find(
              (el) =>
                (el.from === e.id && el.to === store.focusedPerson.id) ||
                (el.to === e.id && el.from === store.focusedPerson.id)
            )
        )
        .filter((node) => node.treeId === route.params.id);
    });
}

function getParents2(parents) {
  parentsList.value = parents;
  peopleListView.value = !peopleListView.value;
}

async function getParents(type) {
  const response = await axios.get(
    `http://localhost:5000/actors/${type}/${focusedPerson.value.id}`
  );
  parentsList.value = response.data;
  peopleListView.value = !peopleListView.value;
}

async function addPerson() {
  if (
    nodeToAdd.value.firstName &&
    nodeToAdd.value.lastName &&
    nodeToAdd.value.gender &&
    nodeToAdd.value.birthDate
  ) {
    nodeToAdd.value.type
      ? await axios
          .post(`http://localhost:5000/actors/`, {
            ...nodeToAdd.value,
            // generation: parseInt(focusedPerson.value.generation) + 1,
            treeId: route.params.id,
          })
          .then(async (res) => {
            console.log(res.data);
            await axios.post(
              `http://localhost:5000/actors/${nodeToAdd.value.type}/${focusedPerson.value.id}`,
              { parentId: res.data.id }
            );
          })
      : await axios
          .post(`http://localhost:5000/actors/`, {
            ...nodeToAdd.value,
            // generation: parseInt(focusedPerson.value.generation) - 1,
            treeId: route.params.id,
          })
          .then(async (res) => {
            console.log(res.data);
            await axios.post(
              `http://localhost:5000/actors/${
                focusedPerson.value.gender === "male"
                  ? "addFather"
                  : "addMother"
              }/${res.data.id}`,
              { parentId: focusedPerson.value.id }
            );
          });
    store.getTrees().then((data) => {
      store.setTrees(data);
    });
    addPersonView.value = false;
    nodeToAdd.value = {};
  } else {
    console.log(nodeToAdd.value);
    alert("Missing fields");
  }
}

const { focusedPerson } = storeToRefs(store);

function setFocus(personId) {
  console.log(personId);
  store.setFocus(personId);
  focusedPerson.value = store.focusedPerson;
  console.log(focusedPerson.value);
}

async function setDefault(id) {
  await axios.put(
    `http://localhost:5000/actors/setDefault/${store.focusedPerson.id}`,
    { id: id }
  );
  updateTable();
  peopleListView.value = !peopleListView.value;
}

async function updateTable() {
  await store.getTrees().then((data) => {
    console.log(data);
    store.treesList = {
      nodes: data.nodes.filter((node) => node.treeId === route.params.id),
      edges: data.edges.filter((edge) => edge.treeId === route.params.id),
    };
  });
}

onMounted(async () => {
  cloneList.value = await store
    .getTrees()
    .then((res) =>
      res.nodes.filter(
        (node) =>
          node.treeId === loggedUser._id &&
          node.gender === store.focusedPerson?.gender
      )
    );

  console.log("TABLE MOUNTED");
  updateTable();
});
</script>

<style lang="scss" scoped>
.link {
  color: #646cff;
}
.link:hover {
  cursor: pointer;
}
.user-row {
  display: flex;
  justify-content: center;
  gap: 7px;
  > div {
    font-size: 18px;
  }
}
.parent-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 7px;
  margin-top: 5px;
}
.add-ancestor {
  font-size: 35px;
}
.add-ancestor:hover {
  cursor: pointer;
}
.kids-search-siblings {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.tree-person-list {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
}
.user {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: auto;
  width: auto;
  min-width: 300px;
  padding: 5px;
  border-radius: 15px;
}
.searchbar {
  padding: 5px;
  margin: 5px;
  font-size: 18px;
  transition: 0.2s all ease;
}
.searchbar:hover {
  border: 2px solid white;
}
.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.table-column {
  width: 300px;
  height: 500px;
  border: 1px solid white;
}
.table-row-1 {
  width: 100%;
  height: 49.8%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-2 {
  width: 100%;
  height: 24.7%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-row-3 {
  width: 100%;
  height: 12.15%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  font-size: 15px;
}
</style>

export default FamilyTreeTable;
