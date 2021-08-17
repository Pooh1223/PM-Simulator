import Vue from "vue";
import CardColumn from "./components/CardColumn.vue";
import CardFilter from "./components/CardFilter.vue";
//import App from "./App.vue";
//import transition from "./components/transition.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// 安裝 BootstrapVue
Vue.use(BootstrapVue);
// 安裝 BootstrapVue icon components plugin (可選)
Vue.use(IconsPlugin);

new Vue({
  render: (h) => h(CardColumn),
}).$mount(".card-display > #app");

new Vue({
  render: (h) => h(CardFilter),
}).$mount(".card-select > #app");