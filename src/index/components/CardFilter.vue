<template>
  <div class="container card_filter">

    <b-modal 
      id="deck-detail"
      scrollable
      title="Deck-Detail"
      size="xl"
      ok-only
      >
      <div class="row">
        <div
          id="chart"
          class="col-6">
          <apexcharts
            type="bar"
            height="350"
            :options="chartOptions"
            :series="chart_series">
          </apexcharts>
        </div>

        <div class="col-6">
          <b-table
            :items="items"
            :fields="fields"
            responsive="sm"
          >
            <template slot="thead-top">
              <b-tr>
                <b-th colspan="1"><span class="sr-only">Name and ID</span></b-th>
                <b-th variant="primary" colspan="3">Main-deck</b-th>
                <b-th variant="danger" colspan="3">Ex-deck</b-th>
              </b-tr>
            </template>
          </b-table>
        </div>
      </div>

      <div class="row">
        <div
          class="card col-2"
          v-for="element in card_chosen.concat(ex_card_chosen)"
          :key="element.detail.card_number">

          <img
            :src="element.detail.img_url"
            title="Click to check out detail"
            class="card-img-top"
            alt="error" />

          <div class="card-footer bg-transparent row">
            <div
              class="col-6"
              style="display: inline-block;"
              >

              <b-button
                type="submit"
                variant="primary"
                v-b-modal.deck-card-detail
                @click="deckCardDetail = element"
                >
                Detail
              </b-button>
            </div>
            <div 
              class="col-6 mt-auto"
              style="display: inline-block;"
              >
              <h5 class="text-right">{{element.cnt}}/4</h5>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal 
      id="deck-card-detail"
      scrollable
      title="Deck-Detail"
      ok-only
      :data="deckCardDetail"
      >
      <div class="card-container">
        <img :src="deckCardDetail === null ? '../PM_Back.jpg' : deckCardDetail.detail.img_url" />
        <div class="card-attr">

          <table class="table table-striped">
            <tbody>
              <tr
                v-for="(attr, index) in Object.entries(deckCardDetail.detail)"
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

    <div>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">

        <b-form-group
          id="input-group-series"
          label="Series"
          label-for="input-series"
        >
          <b-form-select
            id="input-series"
            v-model="form.series"
            :options="series"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group
          id="input-group-card-number"
          label="Card Number"
          label-for="input-card-number"
        >
          <b-form-checkbox-group
            v-model="form.card_prefix"
            id="checkbox-card-prefix"
          >
            <b-form-checkbox value="P">P</b-form-checkbox>
            <b-form-checkbox value="ST">ST</b-form-checkbox>
          </b-form-checkbox-group>

          <b-form-input
            id="input-card-number"
            v-model="form.number"
            type="number"
            placeholder="Enter card number"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-name"
          label="Card Name"
          label-for="input-name"
        >
          <b-form-input
            id="input-name"
            v-model="form.name"
            type="text"
            placeholder="Enter card name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-cost"
          label="Cost"
          label-for="input-cost"
        >
          <b-form-input
            id="input-cost"
            v-model="form.cost"
            type="number"
            placeholder="Enter cost"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-source"
          label="Source"
          label-for="input-source"
        >
          <b-form-input
            id="input-source"
            v-model="form.source"
            type="number"
            placeholder="Enter source"
            required
          ></b-form-input>
        </b-form-group>

        
        <b-form-group
          id="input-group-ap"
          label="AP:"
          label-for="input-ap">

            <b-form-input
              class="col-5"
              id="input-ap"
              v-model="form.ap_min"
              type="number"
              placeholder="min"
              style="display: inline-block;"
              required
            ></b-form-input>
             ~ 
            <b-form-input
              class="col-5"
              id="input-ap"
              v-model="form.ap_max"
              type="number"
              placeholder="max"
              style="display: inline-block;"
              required
            ></b-form-input>
            
        </b-form-group>

        <b-form-group
          id="input-group-dp"
          label="DP:"
          label-for="input-dp">

            <b-form-input
              class="col-5"
              id="input-dp"
              v-model="form.dp_min"
              type="number"
              placeholder="min"
              style="display: inline-block;"
              required
            ></b-form-input>
            ~
            <b-form-input
              class="col-5"
              id="input-dp"
              v-model="form.dp_max"
              type="number"
              placeholder="max"
              style="display: inline-block;"
              required
            ></b-form-input>
            
        </b-form-group>

        <b-form-group
          id="input-group-type"
          label="Card Type"
          label-for="input-type">
          <b-form-select
            id="input-type"
            v-model="form.type"
            :options="types"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group id="input-group-4" label="Color" v-slot="{ ariaDescribedby }">
          <b-form-checkbox-group
            v-model="form.color"
            id="checkboxes-4"
            :aria-describedby="ariaDescribedby"
          >
            
            <b-form-checkbox value="red">Red🔴</b-form-checkbox>
            <b-form-checkbox value="yellow">Yellow🟡</b-form-checkbox>
            <b-form-checkbox value="blue">Blue🔵</b-form-checkbox>
            <b-form-checkbox value="green">Green🟢</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          >
          Search
        </b-button>
        <b-button
          type="reset"
          variant="danger"
          >
          Reset
        </b-button>
      </b-form>

      <b-card
        class="mt-3"
        header="Your Deck"
        >

        <!--<pre class="m-0">{{ form }}</pre>-->

        <b-list-group v-b-modal.deck-detail>
          <b-list-group-item>
            <h5> Main Deck: </h5>

            <div class="row">
              <div
                class="col-2"
                v-for="element in card_chosen"
                :key="element.detail.card_number"
                style="padding-left: 0px; padding-right: 0px;"
                >

                <img
                  
                  :src="element.detail.img_url"
                  title="Click to check out detail"
                  class="deck-img-tb"
                  alt="error">

              </div>
            </div>

          </b-list-group-item>

          <b-list-group-item>
            <h5> Ex-Deck: </h5>

            <div class="row">
              <div
                class="col-2"
                v-for="element in ex_card_chosen"
                :key="element.detail.card_number"
                style="padding-left: 0px; padding-right: 0px;"
                >

                <img
                  :src="element.detail.img_url"
                  title="Click to check out detail"
                  class="deck-img-tb"
                  alt="error">

              </div>
            </div>
          </b-list-group-item>
        </b-list-group>

        <b-button
          type="submit"
          variant="primary"
          >
          Submit
        </b-button>
        <b-button
          type="reset"
          variant="danger"
          >
          Reset
        </b-button>
      </b-card>
    </div>
  </div>
</template>

<script>
//import ApexCharts from 'apexcharts'
import VueApexCharts from "vue-apexcharts";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';


export default {
  name: "CardFilter",
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    const mydata = require("../../board/data.json");
    //console.log(mydata);
    const tester = mydata.map((detail, index) => {
      return {detail, order: index + 1, excost: 0, exsource: 0, exap: 0, exdp: 0, overlap: [],cnt: 0};
    });
    console.log(tester);
    //console.log(tester.slice(0,1));

    return {
      deckCardDetail: tester[0],
      form: {
        series: null,
        name: '',
        number: '',
        card_prefix: [],
        source: '',
        cost: '',
        ap_min: '',
        ap_max: '',
        dp_min: '',
        dp_max: '',
        type: null,
        color: []
      },
      types: [{ text: 'Select One', value: null }, 'Character', 'Support', 'Event'],
      series: [{ text: 'Select One', value: null }, 'jizz'],
      show: true,

      //tester[0],tester[1],tester[2],tester[3],tester[4],tester[5]
      card_chosen: [],
      ex_card_chosen: [],

      // charts

      chart_series: [{
        data: [0, 0, 0, 0]
      }],
      chartOptions: {
        chart: {
          id: "basic-bar",
          height: 350,
          type: 'bar',
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            distributed: true
          }
        },
        colors: ["#FC2E02","#FCE502","#02FC3B","#029AFC"],
        xaxis: {
          categories: [
            '紅','黃','綠','藍'
          ],
          labels: {
            style: {
              colors: '#000000',
              fontSize: '12px'
            }
          }
        }
      },

      // table
      fields: [
        'type',
        {key: 'source.main', label: 'Source'},
        {key: 'cost.main', label: 'Cost'},
        {key: 'cards.main', label: 'Cards'},
        {key: 'source.ex', label: 'Source'},
        {key: 'cost.ex', label: 'Cost'},
        {key: 'cards.ex', label: 'Cards'},
      ],
      items: [
        { type: 'Character', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0} },
        { type: 'Support', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0} },
        { type: 'Event', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0} },
        { type: 'Total', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0} }
      ]
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.series = null;
      this.form.name = '';
      this.form.source = '';
      this.form.cost = '';
      this.form.ap_min = '';
      this.form.ap_max = '';
      this.form.dp_min = '';
      this.form.dp_max = '';
      this.form.type = null;
      this.form.color = [];

      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      })
    },
    showTable(id) {
      return (id != 0);
    },
    colorToIndex(color) {
      let id = -1;

      switch(color){
        case '赤':
          id = 0;
          break;
        case '黄':
          id = 1;
          break;
        case '緑':
          id = 2;
          break;
        case '青':
          id = 3;
          break;
      }

      return id;
    },
  },
  mounted() {
    this.$bus.$on("add-to-deck",(card) => {
      if(card.cnt == 1){
        // new card just added

        if(card.detail.effect.includes("EXカード")){
          this.ex_card_chosen.push(card);
        } else {
          this.card_chosen.push(card);
        }

        console.log(card);
        console.log("added");
      }

      // add color column
      let colorId = this.colorToIndex(card.detail.color);
      this.chart_series[0].data[colorId]++;
    });

    this.$bus.$on("remove-from-deck",(card) => {

      if(card.cnt == 0){
        if(card.detail.effect.includes("EXカード")){
          for(let i = 0;i < this.ex_card_chosen.length;++i){
            if(card.detail.card_number == this.ex_card_chosen[i].detail.card_number &&
              card.detail.lines == this.ex_card_chosen[i].detail.lines){
                this.ex_card_chosen.splice(i,1);
                console.log("deleted");
                break;
              }
          }
        } else {
          for(let i = 0;i < this.card_chosen.length;++i){
            if(card.detail.card_number == this.card_chosen[i].detail.card_number &&
              card.detail.lines == this.card_chosen[i].detail.lines){
                this.card_chosen.splice(i,1);
                console.log("deleted");
                break;
              }
          }
        }
          
        console.log(this.card_chosen);
      }

      // remove color column
      let colorId = this.colorToIndex(card.detail.color);
      this.chart_series[0].data[colorId]--;
    });
  }
};
</script>

<style>
.card_filter {
  border: 2px black solid;
  height: 90vh;
  overflow-y: scroll;
}
.deck-img-tb {
  width: 100%;
}
</style>
