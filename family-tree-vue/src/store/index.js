import { defineStore } from "pinia";
import axios from "axios";

const dbUrl = `http://localhost:4000/api`;

export const userStore = defineStore("main", {
  state: () => ({
    usersList: [],
    treesList: [],
    loggedUser: null,
  }),
  actions: {
    async getUsers() {
      return fetch("http://localhost:4000/api/users/").then((response) =>
        response.json()
      );
    },
    setStore(store) {
      this.usersList = store;
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
    isUnique(user) {
      const usernames = this.usersList.map((user) => user.username);
      const emails = this.usersList.map((user) => user.email);
      if (usernames.includes(user.username)) {
        alert("This username is already taken!");
        return false;
      }
      if (emails.includes(user.email)) {
        alert("This email is already taken!");
        return false;
      }
      return true;
    },
    async editUser(user) {
      if (this.isUnique(user)) {
        await axios.put(`${dbUrl}/users/${user._id}`, user).then((res) => {
          console.log(res.data);
          this.loggedUser = res.data.updatedUser;
        });
        return true;
      } else {
        return false;
      }
    },
    async registerUser(user) {
      this.isUnique(user) &&
        (await axios.post(`${dbUrl}/users/register`, user).then((res) => {
          this.$router.push("Home");
          this.loggedUser = res.data;
        }));
    },
    async loginUser(user) {
      const response = await axios
        .post(`${dbUrl}/users/login`, user)
        .then((res) => {
          this.loggedUser = res.data;
          return "Success";
        })
        .catch((err) => {
          return "Fail";
        });
      return response;
    },
    logoutUser() {
      this.loggedUser = null;
    },
  },
});
