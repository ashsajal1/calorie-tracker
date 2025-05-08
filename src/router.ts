import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./pages/Home.vue";
import AboutView from "./pages/About.vue";
import NotFound from "./pages/NotFound.vue";
import Profile from "./pages/Profile.vue";

const routes = [
  {
    path: "/",
    meta: { title: "Home", description: "Welcome to our homepage." },
    component: HomeView,
  },
  {
    path: "/about",
    component: AboutView,
    meta: {
      title: "About Us",
      description: "Learn more about us on this page.",
    },
  },
  {
    path: "/profile",
    component: Profile,
    meta: {
      title: "Profile",
      description: "See or edit your profile here.",
    },
  },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
