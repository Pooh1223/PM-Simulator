<template>
<div class="container vertical-scrollable">
  <div class="row">
    <div
      class="card col-4" 
      
      v-for="element in card_list"
      :key="element.detail.card_number">

      <img
        :src="element.detail.img_url"
        class="card-img-top"
        alt="error">

      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>

    </div>
  </div>
</div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';


export default {
  name: "CardColumn",
  components: {
    
  },
  data() {
    const mydata = require("../../board/data.json");
    //console.log(mydata);
    const tester = mydata.map((detail, index) => {
      return {detail, order: index + 1, excost: 0, exsource: 0, exap: 0, exdp: 0, overlap: []};
    });
    console.log(tester);
    //console.log(tester.slice(0,1));

    return {
      card_list: tester,
      drag: false,
      modalData: tester[0],
      
    };
  }
};
</script>

<style>
.vertical-scrollable> .row {
  positoin:  absolute;
  overflow-y: scroll;
  max-height: 90vh;
}
</style>
