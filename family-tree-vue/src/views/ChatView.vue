<template>
  <div class="chat-container">
    <h2>Main chat</h2>
    <div class="messages-container">
      <ul class="messages" v-for="message in chatData.messages">
        <li>
          <div
            class="link"
            @click="this.$router.push(`/users/${message.author}`)"
          >
            {{ store.getUsername(message.author) + ":" }}
          </div>
          <div>{{ message.message }}</div>
        </li>
      </ul>
      <div class="input-container">
        <input
          class="input"
          @change="(e) => (message = e.target.value)"
          :value="message"
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import socket from "../socket";
import { userStore } from "../store";
const store = userStore();
const message = ref("");
const chatData = ref({});
const loggedUser = !sessionStorage.loggedUser
  ? {}
  : JSON.parse(sessionStorage.loggedUser);

function sendMessage() {
  store.sendMessage(loggedUser, message.value, chatData.value._id);
  // console.log(loggedUser);
  chatData.value.messages.push({
    author: loggedUser._id,
    message: message.value,
  });
  socket.emit("message", { author: loggedUser, msg: message.value });
  message.value = "";
}

socket.on("message", ({ author, message }) => {
  // console.log({ author: author, message: message });
  chatData.value.messages.push({ author: author._id, message: message });
});

onMounted(async () => {
  console.log("CHAT MOUNTED");
  const room = await store.getRooms();
  // console.log(room[0]);
  // console.log(store.chatRooms[0]);
  chatData.value = store.chatRooms.filter((e) => e.name === "main")[0];
  // console.log(chatData.value);
});
</script>

<style scoped>
.link {
  color: #646cff;
}
.link:hover {
  cursor: pointer;
}

li {
  display: flex;
  gap: 3px;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
}
.input {
  height: 30px;
  width: 100%;
  font-size: 16px;
}
.messages-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: calc(100vh - 150px);
}
.messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  margin: 5px;
  padding: 0;
}
.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: calc(100vw - 100px);
}
</style>
