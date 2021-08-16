import Vue from "vue";
import CardColumn from "./components/CardColumn.vue";
//import App from "./App.vue";
//import transition from "./components/transition.vue";

new Vue({
  render: (h) => h(CardColumn),
}).$mount("#app");