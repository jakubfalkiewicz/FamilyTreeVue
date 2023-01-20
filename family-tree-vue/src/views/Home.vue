<script setup>
import { onMounted, ref } from "vue";
import { userStore } from "../store";

const store = userStore();
const peopleDB = ref(null);
const search = ref("");

onMounted(() => {
  store.getUsers().then((data) => {
    store.setStore(data);
  });
  store.getTrees().then((data) => {
    // console.log(data.nodes.map(node => ({name: `${node.firstName} ${node.lastName}`, birth: node.birthDate, treeId: node.treeId}) ));
    peopleDB.value = data.nodes.map((node) => ({
      name: `${node.firstName} ${node.lastName}`,
      birth: node.birthDate,
      treeId: node.treeId,
      gender: node.gender,
    }));
    store.setTrees(data);
  });
});
</script>

<template>
  <div v-if="store.loggedUser">
    Logged as:
    <a :href="'/users/' + store.loggedUser._id">{{
      store.loggedUser.username
    }}</a>
  </div>
  <h1>Home</h1>
  <div class="users-list">
    <div
      v-for="post in store.usersList"
      class="user"
      @click="this.$router.push(`/users/${post._id}`)"
    >
      <div>{{ post.username }}</div>
      <div>{{ post.email }}</div>
    </div>
  </div>
  <div :style="{ marginTop: 10 + 'px' }">Find family tree member</div>
  <input
    type="text"
    :value="search"
    class="searchbar"
    placeholder="Search by name, surname"
    @change="(e) => (search = e.target.value)"
  />
  <div class="tree-person-list">
    <div
      v-if="peopleDB != null"
      v-for="person in peopleDB.filter((p) => {
        return p.name.toLowerCase().includes(search.toLowerCase());
      })"
      class="user"
      @click="this.$router.push(`/users/${person.treeId}`)"
      :style="{
        border: 2 + 'px',
        borderStyle: 'solid',
        borderColor: person.gender == 'male' ? 'lightskyblue' : 'hotpink',
      }"
    >
      <div :style="{ fontSize: 18 + 'px' }">{{ person.name }}</div>
      <div>{{ person.birth }}</div>
    </div>
  </div>
</template>

<style scoped>
.searchbar {
  padding: 5px;
  font-size: 18px;
  transition: 0.2s all ease;
}
.searchbar:hover {
  border: 2px solid white;
}
h1 {
  margin: 10px;
}
.users-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.tree-person-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.user {
  min-width: 100px;
  width: auto;
  border: 1px solid white;
  border-radius: 15px;
  padding: 9px;
  margin: 7px;
  transition: 0.3s all ease;
}
.user:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.199);
}
</style>
