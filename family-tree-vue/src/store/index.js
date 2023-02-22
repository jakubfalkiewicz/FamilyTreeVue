import { defineStore } from "pinia";
import axios from "axios";
import socket from "../socket";

const treeUrl = `http://localhost:5000`;

const axiosSetup = axios.create({
  baseURL: "https://localhost:4000/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

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
          (edge) =>
            edge.to === id && edge.type === "IS_FATHER" && edge.default === true
        ) || null;
      return rels
        ? this.treesList.nodes.find((user) => user.id === rels.from)
        : null;
    },
    hasAnyFather(id) {
      const rels =
        this.treesList.edges
          .filter((edge) => edge.to === id && edge.type === "IS_FATHER")
          .map((e) => e.from) || null;
      return rels
        ? this.treesList.nodes.filter((user) => rels.includes(user.id))
        : null;
    },
    hasMother(id) {
      const rels =
        this.treesList.edges.find(
          (edge) =>
            edge.to === id && edge.type === "IS_MOTHER" && edge.default === true
        ) || null;
      return rels
        ? this.treesList.nodes.find((user) => user.id === rels.from)
        : null;
    },
    hasAnyMother(id) {
      const rels =
        this.treesList.edges
          .filter((edge) => edge.to === id && edge.type === "IS_MOTHER")
          .map((e) => e.from) || null;
      return rels
        ? this.treesList.nodes.filter((user) => rels.includes(user.id))
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
    async delNode(id) {
      await axios.delete(`http://localhost:5000/actors/${id}`);
      this.refreshTrees();
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
        ?.username;
    },
    async getUsers() {
      return axiosSetup.get("/api/users/").then((response) => {
        return response.data.users;
      });
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
    async refreshTrees() {
      await this.getTrees().then((store) => {
        this.treesList = store;
      });
    },
    async delRel(parentId, childId) {
      await axios.delete("http://localhost:5000/actors/delRel", {
        data: { parentId: parentId, childId: childId },
      });
      this.refreshTrees();
    },
    async cloneTree(from, to) {
      await axios.post(`http://localhost:5000/actors/cloneSubgraph/${to}`, {
        id: from,
      });
      this.refreshTrees();
    },
    getUser(id) {
      return this.usersList.filter((user) => user._id === id)[0];
    },
    async getRooms() {
      this.chatRooms = await axiosSetup.get("/api/rooms/").then((response) => {
        console.log(response.data);
        return response.data;
      });
      return this.chatRooms;
    },
    async createRoom(name) {
      const users = name.split("-");
      return await axiosSetup
        .post(`/api/rooms/`, {
          name: name,
          joinedUsers: users,
          messages: [],
        })
        .then((res) => {
          // console.log(res.data);
        });
    },
    async sendMessage(author, message, roomId) {
      const room = await axiosSetup
        .get(`/api/rooms/${roomId}`)
        .then((res) => res.data[0]);
      // console.log(room);
      room.messages.push({ author: author, message: message });
      await axiosSetup.put(`/api/rooms/${roomId}`, {
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
        await axiosSetup.put(`/api/users/${user._id}`, user).then((res) => {
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
        const response = await axiosSetup
          .post(`/api/users/register`, user)
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
      const response = await axiosSetup
        .post(`/api/users/login`, user)
        .then((res) => {
          console.log(res.data);
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
      axiosSetup.post(`/api/users/logout`, user).then((res) => {
        this.loggedUsers = this.loggedUsers.filter((e) => e._id !== user._id);
        sessionStorage.removeItem("loggedUser");
      });
    },
  },
});
