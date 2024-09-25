import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/home.vue";

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/MyTeam", component: Home, name: "MyTeam" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
