import { def } from "@vue/shared";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "", name: "home", component: () => import("@/views/Home.vue") },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/users/:id",
    name: "users",
    component: () => import("@/views/UserView.vue"),
  },
  {
    path: "/tree",
    name: "tree",
    component: () => import("@/views/FamilyTree.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
