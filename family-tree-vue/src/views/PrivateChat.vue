<template>
  <div>
    <div class="header">
      <h2>
        Chat with
        {{ store.usersList.find((o) => o._id === route.params.id).username }}
      </h2>
    </div>

    <ul class="messages">
      <li v-for="message in chatData" :key="message._id" class="message">
        <div>
          {{ store.getUsername(message.author) }}: {{ message.message }}
        </div>
      </li>
    </ul>

    <form @submit.prevent="sendMessage" class="form">
      <textarea v-model="input" placeholder="Your message..." class="input" />
      <button :disabled="input.length == 0" class="send-button">Send</button>
    </form>
  </div>
</template>

<script setup>
import { userStore } from "../store";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import socket from "../socket";
import privateSocket from "../privateSocket";

const input = ref("");
const store = userStore();
const route = useRoute();
const loggedUser = ref(null);
const chatData = ref([]);
const room = ref(null);

privateSocket.on("private message", ({ content, from }) => {
  console.log("Got private message");
  console.log(from);
  console.log(store.loggedUsers);
  const senderSocket = store.loggedUsers.find((e) => e._id === from);
  console.log(senderSocket);
  if (senderSocket._id === route.params.id) {
    chatData.value.push({
      author: route.params.id,
      message: content,
    });
  }
});

function sendMessage() {
  console.log(store.loggedUsers);
  const socketReceiver = store.loggedUsers.find(
    (e) => e._id === route.params.id
  );
  console.log(socketReceiver);
  socketReceiver &&
    privateSocket.emit("private message", {
      content: input.value,
      to: route.params.id,
    });
  store.sendMessage(loggedUser.value, input.value, room.value._id);
  chatData.value.push({
    author: loggedUser.value,
    message: input.value,
  });
  input.value = "";
}

onMounted(async () => {
  console.log("CHAT MOUNTED");
  loggedUser.value = !sessionStorage.loggedUser
    ? {}
    : JSON.parse(sessionStorage.loggedUser);

  if (loggedUser.value === null) {
    console.log("REDIRECTING");
    window.location.href = "/login";
  }
  const rooms = await store.getRooms();
  room.value = rooms.find(
    (room) =>
      room.name.includes(route.params.id) &&
      room.name.includes(loggedUser.value._id)
  );
  console.log(room.value);
  console.log(route.params.id);
  console.log(loggedUser.value._id);
  !room.value && store.createRoom(`${route.params.id}-${loggedUser.value._id}`);
  if (room.value) {
    console.log(room.value.messages);
    chatData.value = room.value.messages;
  }
});
</script>

<style scoped>
.header {
  line-height: 40px;
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
}

.messages {
  margin: 0;
  padding: 20px;
}

.message {
  list-style: none;
}

.sender {
  font-weight: bold;
  margin-top: 5px;
}

.form {
  padding: 10px;
}

.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}

.send-button {
  vertical-align: top;
}
</style>
