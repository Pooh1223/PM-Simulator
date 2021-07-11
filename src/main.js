import Vue from "vue";
//import App from "./App.vue";
import transition from "./components/transition.vue";
import point from "./components/point.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// 安裝 BootstrapVue
Vue.use(BootstrapVue);
// 安裝 BootstrapVue icon components plugin (可選)
Vue.use(IconsPlugin);

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