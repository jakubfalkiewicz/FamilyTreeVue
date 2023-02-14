<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { userStore } from "../store";
import { RouterLink } from "vue-router";
import socket from "../socket";

const store = userStore();
const loggedUser = ref(null);

const peopleDB = ref(null);
const search = ref("");
const dropdown = ref(false);

function logout() {
  store.logoutUser(loggedUser.value);
  loggedUser.value = null;
}

onMounted(async () => {
  console.log("HOME MOUNTED");
  store.getUsers().then((data) => {
    store.setStore(data);
  });
  store.getTrees().then((data) => {
    peopleDB.value = data.nodes
      .map((node) => ({
        name: `${node.firstName} ${node.lastName}`,
        birth: node.birthDate,
        treeId: node.treeId,
        gender: node.gender,
      }))
      .filter((el) => el.treeId !== loggedUser.value._id);
    store.setTrees(data);
  });
  // loggedUser.value = JSON.parse(sessionStorage.getItem("loggedUser"));
  loggedUser.value = !sessionStorage.loggedUser
    ? null
    : JSON.parse(sessionStorage.loggedUser);
  if (loggedUser.value === null) {
    console.log("REDIRECTING");
    window.location.href = "/login";
  }
  if (loggedUser.value) {
    setTimeout(() => {
      loggedUser.value.socketId = socket.id;
      sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser.value));
      store.userRefresh(loggedUser.value);
    }, 200);
  }
  // const usersChats = await store.getRooms();
  // console.log(usersChats);
  // // const people = store.usersList.filter((us) =>
  // //   store.chatRooms
  // //     .filter((e) => e.name.includes(loggedUser.value._id))
  // //     .map((el) =>
  // //       el.joinedUsers.filter((user) => user !== loggedUser.value._id)
  // //     )[0]
  // //     .includes(us._id)
  // // );
  // const people = store.usersList.reduce((prev,curr) => {

  // },[])
  // console.log(people);
});
</script>

<template>
  <nav>
    <div v-if="loggedUser && loggedUser._id">
      <router-link class="link" to="/">Home</router-link> |
      <router-link class="link" to="/chat/public">Chat</router-link> |
      <button
        class="nav-logout"
        v-if="store.loggedUsers.some((e) => e._id === loggedUser._id)"
        @click="logout"
      >
        Logout
      </button>
    </div>
    <div v-else>
      <router-link class="link" to="/">Home</router-link> |
      <router-link class="link" to="/register">Register</router-link> |
      <router-link class="link" to="/login">Login</router-link>
    </div>
  </nav>
  <div v-if="loggedUser" class="logged-container">
    <div>Logged as:</div>
    <div class="link" @click="this.$router.push(`/users/${loggedUser._id}`)">
      {{ loggedUser.username }}
    </div>
  </div>

  <!-- <div class="users-list">
    <h3>Active chats</h3>
    <div
      v-for="user in store.usersList"
      class="user-logged"
      @click="this.$router.push(`/users/${user._id}`)"
    >
      <div>{{ user.username }}</div>
      <div>{{ user.email }}</div>
    </div>
    <div
      v-for="post in store.usersList.filter(
        (e) => !store.loggedUsers.map((el) => el._id).includes(e._id)
      )"
      class="user"
      @click="this.$router.push(`/users/${post._id}`)"
    >
      <div>{{ post.username }}</div>
      <div>{{ post.email }}</div>
    </div>
  </div> -->
  <div class="home">
    <h1>Home</h1>
    <div :style="{ marginTop: 10 + 'px' }">Find family tree member</div>
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
/* .home {
  width: 80%;
}
nav {
  width: 80%;
} */
.logged-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  /* width: 80%; */
}
.link {
  color: #646cff;
}
.link:hover {
  cursor: pointer;
}
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
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border: 2px solid rgb(255, 255, 255);
  height: 100%;
  width: 20%;
}
.tree-person-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* width: 80%; */
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
.user-logged {
  min-width: 100px;
  width: auto;
  border: 1px solid rgb(0, 255, 85);
  border-radius: 15px;
  padding: 9px;
  margin: 7px;
  transition: 0.3s all ease;
}
.user:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.199);
}
.user-logged:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.199);
}
</style>
