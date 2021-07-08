<template>
  <transition></transition>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
import transition from "./components/transition.vue";

export default {
  name: "App",
  components: {
    //HelloWorld,
    transition,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
