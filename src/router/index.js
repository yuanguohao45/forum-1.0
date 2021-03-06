import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/Home"
    },
    {
      path: "/Home",
      name: "Home",
      component: () => import("@/views/Home")
    },
    {
      path: "/PreOrder",
      name: "PreOrder",
      component: () => import("@/views/PreOrder")
    },
    {
      path: "/LuckDraw",
      name: "LuckDraw",
      component: () => import("@/views/LuckDraw")
    },
    {
      path: "/PreReview",
      name: "PreReview",
      component: () => import("@/views/PreReview")
    },
    {
      path: "/SMS",
      name: "SMS",
      component: () => import("@/views/SMS")
    }
  ]
});
