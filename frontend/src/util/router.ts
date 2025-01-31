import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/home.vue"
import Analytics from "../pages/analytics.vue"

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/MyTeam", component: Home, name: "MyTeam" },
  { path: "/analytics", component: Analytics, name: "Analytics" },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
