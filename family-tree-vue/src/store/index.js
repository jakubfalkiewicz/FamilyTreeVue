import { defineStore } from "pinia";
import axios from "axios";
import socket from "../socket";

const dbUrl = `http://localhost:4000/api`;
const treeUrl = `http://localhost:5000`;

export const userStore = defineStore("main", {
  state: () => ({
    usersList: [],
    treesList: [],
    loggedUser: null,
    loggedUsers: [],
    chatRooms: [],
    focusedPerson: null,
  }),
  actions: {
    setFocus(id) {
      this.focusedPerson = this.treesList.nodes.find((user) => user.id === id);
    },
    hasFather(id) {
      const rels =
        this.treesList.edges.find(
          (edge) => edge.to === id && edge.type === "IS_FATHER"
        ) || null;
      return rels
        ? this.treesList.nodes.find((user) => user.id === rels.from)
        : null;
    },
    hasMother(id) {
      const rels =
        this.treesList.edges.find(
          (edge) => edge.to === id && edge.type === "IS_MOTHER"
        ) || null;
      return rels
        ? this.treesList.nodes.find((user) => user.id === rels.from)
        : null;
    },
    getKids(id) {
      const rels = this.treesList.edges
        .filter((edge) => edge.from === id)
        .map((e) => e.to);
      return rels
        ? this.treesList.nodes.filter((e) => rels.includes(e.id))
        : [];
    },
    userRefresh(user) {
      this.usersList = this.usersList.filter((e) => e._id !== user._id);
      this.usersList.push(user);
      this.loggedUsers = this.loggedUsers.filter((e) => e._id !== user._id);
      this.loggedUsers.push(user);
      // console.log(this.loggedUsers);
    },
    getUsername(id) {
      return this.usersList.filter((e) => e._id === id || e._id === id._id)[0]
        .username;
    },
    async getUsers() {
      return fetch("http://localhost:4000/api/users/").then((response) =>
        response.json()
      );
    },
    setStore(store) {
      this.usersList = store;
      // console.log(store);
    },
    async getTrees() {
      return fetch("http://localhost:5000/actors").then((response) =>
        response.json()
      );
    },
    setTrees(store) {
      this.treesList = store;
    },
    getUser(id) {
      return this.usersList.filter((user) => user._id === id)[0];
    },
    async getRooms() {
      this.chatRooms = await fetch("http://localhost:4000/api/rooms/").then(
        (response) => response.json()
      );
      return this.chatRooms;
    },
    async createRoom(name) {
      const users = name.split("-");
      return await axios
        .post(`http://localhost:4000/api/rooms/`, {
          name: name,
          joinedUsers: users,
          messages: [],
        })
        .then((res) => {
          // console.log(res.data);
        });
    },
    async sendMessage(author, message, roomId) {
      const room = await axios
        .get(`http://localhost:4000/api/rooms/${roomId}`)
        .then((res) => res.data[0]);
      // console.log(room);
      room.messages.push({ author: author, message: message });
      await axios.put(`http://localhost:4000/api/rooms/${roomId}`, {
        ...room,
        messages: room.messages,
      });
    },
    async isUnique(user) {
      const usernames = this.usersList.map((user) => user.username);
      const emails = this.usersList.map((user) => user.email);
      if (usernames.includes(user.username)) {
        // alert("This username is already taken!");
        return false;
      }
      if (emails.includes(user.email)) {
        // alert("This email is already taken!");
        return false;
      }
      return true;
    },
    async editUser(user) {
      if (this.isUnique(user)) {
        await axios.put(`${dbUrl}/users/${user._id}`, user).then((res) => {
          // console.log(user);
          sessionStorage.setItem(
            "loggedUser",
            JSON.stringify({ ...user, socketId: socket.id })
          );
          this.userRefresh({ ...user, socketId: socket.id });
        });
        return true;
      } else {
        return false;
      }
    },
    async registerUser(user) {
      if (this.isUnique(user)) {
        const response = await axios
          .post(`${dbUrl}/users/register`, user)
          .then(async (res) => {
            sessionStorage.setItem(
              "loggedUser",
              JSON.stringify({ ...res.data, socketId: socket.id })
            );
            socket.user = res.data;
            this.loggedUsers.push({ ...res.data, socketId: socket.id });
            return await axios
              .post(`${treeUrl}/actors`, {
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                generation: 1,
                birthDate: user.birthDate,
                treeId: res.data._id,
              })
              .then(() => {
                return "Success";
              });
          });
        return response;
      } else return false;
    },
    async loginUser(user) {
      // console.log(user);
      const response = await axios
        .post(`${dbUrl}/users/login`, user)
        .then((res) => {
          sessionStorage.setItem(
            "loggedUser",
            JSON.stringify({ ...res.data, socketId: socket.id })
          );
          // console.log(res);
          socket.user = res.data;
          this.loggedUsers.push({ ...res.data, socketId: socket.id });
          socket.emit("assign-user", {
            userId: res.data._id,
            socketId: socket.id,
          });
          return "Success";
        })
        .catch((err) => {
          return "Fail";
        });
      return response;
    },
    logoutUser(user) {
      // console.log(user);
      this.loggedUsers = this.loggedUsers.filter((e) => e._id !== user._id);
      // console.log(this.loggedUsers);
      sessionStorage.removeItem("loggedUser");
    },
  },
});
