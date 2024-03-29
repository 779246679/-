import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "demo",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/pdfDemo.vue"),
  },
  {
    path: "/pdf",
    name: "pdf",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/pdfDemo.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
