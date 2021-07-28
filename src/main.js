import Vue from "vue";
//import App from "./App.vue";
//import transition from "./components/transition.vue";
import HandArea from "./components/HandArea.vue";
import SupportArea from "./components/SupportArea.vue";
import MainArea from "./components/MainArea.vue";
import Point from "./components/Point.vue";

import Deck from "./components/Deck.vue";
import Discard from "./components/Discard.vue";
import Excluded from "./components/Excluded.vue";
import ExCard from "./components/ExCard.vue";
import TempCard from "./components/TempCard.vue";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// 安裝 BootstrapVue
Vue.use(BootstrapVue);
// 安裝 BootstrapVue icon components plugin (可選)
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

// use event bus
Vue.prototype.$bus = new Vue();

new Vue({
  render: (h) => h(HandArea),
}).$mount("#hand > #app");

new Vue({
  render: (h) => h(SupportArea),
}).$mount("#support-area > #app");

new Vue({
  render: (h) => h(MainArea),
}).$mount("#main-area > #app");

new Vue({
  render: (h) => h(Point),
}).$mount("#point-area > #points");

new Vue({
  render: (h) => h(Deck),
}).$mount("#deck-area > #app");

new Vue({
  render: (h) => h(Discard),
}).$mount("#discard-area > #app");

new Vue({
  render: (h) => h(TempCard),
}).$mount("#temp-card-place > #app");

new Vue({
  render: (h) => h(ExCard),
}).$mount("#ex-deck-area > #app");

new Vue({
  render: (h) => h(Excluded),
}).$mount("#excluded-area > #app");