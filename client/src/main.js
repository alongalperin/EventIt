import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./router/routes";

Vue.config.productionTip = false;

Vue.use(VueRouter);
const router = new VueRouter({ routes, mode: "history" });
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_KEY,
    libraries: "places",
    v: "3",
  },
});

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
