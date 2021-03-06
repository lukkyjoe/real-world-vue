import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Search from "./views/ModelAjax.vue"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Autosuggest.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/search",
      name: "search",
      component: () => import("./views/Autosuggest.vue")
    },
    {
      path: "/results",
      name: "results",
      component: () => import("./views/Results.vue")
    },
    {
      path: '/autosuggest',
      name: "autosuggest",
      component: () => import("./views/Autosuggest.vue")
    },
    {
      path: '/*',
      component: 404
    }
  ]
});
