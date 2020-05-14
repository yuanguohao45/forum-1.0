// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import "Assets/scss/index.scss";
import "Assets/scss/custom.scss";
import "babel-polyfill";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import "lib-flexible/flexible.js";
import remConfig from "./utils/rem";
remConfig();

Vue.use(ElementUI);
Vue.prototype.$store = store;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
