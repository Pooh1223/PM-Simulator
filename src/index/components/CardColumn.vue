<template>
<div class="container vertical-scrollable">

  <b-modal 
    id="choose-detail"
    scrollable
    title="Card-Detail"
    :data="modalData">
    <div class="card-container">
      <img :src="modalData === null ? '../PM_Back.jpg' : modalData.detail.img_url" />
      <div class="card-attr">
        <!--<b-table striped hover :items="modalData === null ? [] : addInArray(modalData.detail)"></b-table>-->

        <table class="table table-striped">
          <tbody>
            <tr
              v-for="(attr, index) in Object.entries(modalData.detail)"
              :key="attr.card_number"
              >
              <th v-if="showTable(index)">{{attr[0]}}</th>
              <td 
                class="text-dark"
                v-if="showTable(index)"
                >
                {{attr[1]}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </b-modal>

  <div class="row">
    <div
      class="card col-4"
      v-for="(element, index) in card_list"
      :key="element.detail.card_number">

      <img
        :src="element.detail.img_url"
        title="Click to check out detail"
        v-b-modal.choose-detail
        class="card-img-top"
        @click="modalData = element"
        alt="error">

      <div class="card-body d-flex flex-column">
        <h6 class="card-title">{{element.detail.card_number}} {{element.detail.card_name}}</h6>
        <p class="card-text">{{element.detail.type}}</p>
        <p>
          <strong> Source: {{element.detail.source}} </strong>
          <br>
          <strong> Cost: {{element.detail.cost}} </strong>
          <br>
          <strong v-if="notValue(element.detail.AP)"> AP: {{element.detail.AP}}</strong>
          <br>
          <strong v-if="notValue(element.detail.DP)"> DP: {{element.detail.DP}}</strong>
        </p>
        
        <div class="btn-group mt-auto">
          <b-button
            class="btn-line"
            variant="outline-danger"
            @click="addCard(index)"
            >
            +
          </b-button>
          <b-button
            class="btn-line"
            variant="outline-danger"
            @click="removeCard(index)"
            >
            -
          </b-button>
          <p class="my-auto float-right">&nbsp;&nbsp;{{element.cnt}}/4</p>
        </div>
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
    
    const tester = mydata.map((detail, index) => {
      return {detail, order: index + 1, excost: 0, exsource: 0, exap: 0, exdp: 0, overlap: [], cnt: 0};
    });
    console.log(tester);
    
    //const counter = [];

    //for(let i = 0;i < tester.length;++i){
    //  counter.push(0);
    //}

    return {
      card_list: tester,
      drag: false,
      modalData: tester[0],
      //card_count: counter,
    };
  },
  methods: {
    notValue(data) {
      return !isNaN(parseInt(data));
    },
    addInArray(data) {
      return [data];
    },
    showTable(id) {
      return (id != 0);
    },
    addCard(id) {
      //let pre_count = this.card_count[id];

      if(this.card_list[id].cnt != 4){
        this.card_list[id].cnt += 1;
        //this.card_count.splice(id,1,this.card_list[id].cnt);
        this.$bus.$emit("add-to-deck",this.card_list[id]);
        console.log("emit add card");
      }
    },
    removeCard(id) {
      //let pre_count = this.card_count[id];

      if(this.card_list[id].cnt != 0){
        this.card_list[id].cnt -= 1;
        //this.card_count.splice(id,1,this.card_list.cnt);
        this.$bus.$emit("remove-from-deck",this.card_list[id]);
        console.log("emit remove card");
      }
    },
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
