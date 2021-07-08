import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#hand > #app");

new Vue({
  render: (h) => h(App),
}).$mount("#support-area > #app");

new Vue({
  render: (h) => h(App),
}).$mount("#main-area > #app");
