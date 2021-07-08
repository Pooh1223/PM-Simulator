import Vue from "vue";
//import App from "./App.vue";
import transition from "./components/transition.vue"
import point from "./components/point.vue"

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(transition),
}).$mount("#hand > #app");

new Vue({
  render: (h) => h(transition),
}).$mount("#support-area > #app");

new Vue({
  render: (h) => h(transition),
}).$mount("#main-area > #app");

new Vue({
  render: (h) => h(point),
}).$mount("#point-area > #points");
