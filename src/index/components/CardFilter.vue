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
            ref="realtimeChart"
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

          <div class="row" style="padding-left: 10px; padding-right: 10px;">
            <div
              class="col-7 text-danger not-deck-warning">
              <p style="margin-bottom: 0px;">JIZZ</p>
              <p style="margin-bottom: 0px;">JIZZ</p>
              <p style="margin-bottom: 0px;">JIZZ</p>
            </div>

            <!--<div class="col-1"></div>-->

            <b-button
              class="col-5"
              type="submit"
              variant="primary"
              @click="deckToJson"
              >
              Download Deck
            </b-button>
          </div>
        </div>
      </div>

      <div class="row">
        <div
          class="card col-2"
          v-for="(element, index) in main_card_chosen.concat(ex_card_chosen)"
          :key="element.detail.card_number">

          <img
            :src="element.detail.img_url"
            title="Click to check out detail"
            class="card-img-top"
            alt="error" />

          <div class="card-footer bg-transparent row">

            <div class="mt-auto">
              <h5 class="text-center">{{element.cnt}}/4</h5>
            </div>

            <div
              class="btn-group"
              style="padding-left: 0px; padding-right: 0px;"
              >

              <b-button
                type="submit"
                variant="primary"
                v-b-modal.deck-card-detail
                @click="deckCardDetail = element"
                >
                Detail
              </b-button>
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

    <!-- Upload area -->

    <b-modal 
      id="upload-deck"
      ref="upload-deck"
      scrollable
      title="Upload your deck.json file"
      ok-title="Upload"
      @ok="uploadToChosen"
      >
        <div>
          <b-form-file
            v-model="upload_deck"
            :state="Boolean(upload_deck)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            id="selected"
          ></b-form-file>
          <b-button @click="readDeck">Preview</b-button>
        </div>

        <br>
        <h5>Preview of deck</h5>

        <div>
          <b-list-group>
            <b-list-group-item>
              <h5> Main Deck: </h5>

              <div class="row">
                <template v-for="element in upload_main">
                  <div
                    class="col-2"
                    v-for="card in element.cnt"
                    :key="element.detail.card_number + card"
                    style="padding-left: 0px; padding-right: 0px;"
                    >

                    <img
                      :src="element.detail.img_url"
                      title="Click to check out detail"
                      class="deck-img-tb"
                      alt="error">

                  </div>
                </template>
              </div>

            </b-list-group-item>

            <b-list-group-item>
              <h5> Ex-Deck: </h5>

              <div class="row">
                <template v-for="element in upload_ex">
                  <div
                    class="col-2"
                    v-for="card in element.cnt"
                    :key="element.detail.card_number + card"
                    style="padding-left: 0px; padding-right: 0px;"
                    >

                    <img
                      :src="element.detail.img_url"
                      title="Click to check out detail"
                      class="deck-img-tb"
                      alt="error">

                  </div>
                </template>
              </div>
            </b-list-group-item>
          </b-list-group>
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

        <b-list-group v-b-modal.deck-detail>
          <b-list-group-item>
            <h5> Main Deck: </h5>

            <div class="row">
              <div
                class="col-2"
                v-for="element in main_card_chosen"
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
          v-b-modal.upload-deck
          @click="resetUpload"
          >
          Upload
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
import download from "downloadjs";

export default {
  name: "CardFilter",
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    const mydata = require("../../board/data.json");
    //console.log(mydata);
    const tester = mydata.map((detail, index) => {
      return {detail, order: index + 1, excost: 0, exsource: 0, exap: 0, exdp: 0, overlap: [], cnt: 0, coin: 0};
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
      
      main_card_chosen: [],
      ex_card_chosen: [],
      upload_deck: null,
      upload_main: [],
      upload_ex: [],

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
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return val.toFixed(0);
            }
          }
        }
      },

      // table
      fields: [
        'type',
        {key: 'cost.main', label: 'Cost'},
        {key: 'source.main', label: 'Source'},
        {key: 'cards.main', label: 'Cards'},
        {key: 'cost.ex', label: 'Cost'},
        {key: 'source.ex', label: 'Source'},
        {key: 'cards.ex', label: 'Cards'},
      ],
      items: [
        { type: 'Character', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0}},
        { type: 'Support', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0} },
        { type: 'Event', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0} },
        { type: 'Total', source: { main: 0,ex: 0} , cost: { main: 0, ex: 0}, cards: { main: 0, ex: 0} , _rowVariant: 'warning'}
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
    cardTypeConvert(type) {
      let typeId = -1;

      switch(type){
        case 'キャラクター':
          typeId = 0;
          break;
        case 'サポート':
          typeId = 1;
          break;
        case 'イベント':
          typeId = 2;
          break;
      }

      return typeId;
    },

    // update card
    addCard(id) {
      if(id < this.main_card_chosen.length){
        // belongs to main card

        let tmp_card = this.main_card_chosen[id];
        if(tmp_card.cnt != 4){
          tmp_card.cnt += 1;
          this.$bus.$emit("add-to-deck",tmp_card);
          this.updateSeriesLine();
        }        
      } else {
        // belongs to ex card

        let tmp_card = this.ex_card_chosen[id - this.main_card_chosen.length];
        if(tmp_card.cnt != 4){
          tmp_card.cnt += 1;
          this.$bus.$emit("add-to-deck",tmp_card);
          this.updateSeriesLine();
        }   
      }
    },
    removeCard(id) {
      if(id < this.main_card_chosen.length){
        // belongs to main card

        let tmp_card = this.main_card_chosen[id];

        if(tmp_card.cnt != 0){
          tmp_card.cnt -= 1;
          this.$bus.$emit("remove-from-deck",tmp_card);
          this.updateSeriesLine();
        }  
      } else {
        // belongs to ex card

        let tmp_card = this.ex_card_chosen[id - this.main_card_chosen.length];
        if(tmp_card.cnt != 0){
          tmp_card.cnt -= 1;
          this.$bus.$emit("remove-from-deck",tmp_card);
          this.updateSeriesLine();
        }
      }
    },
    // used for update color column
    updateSeriesLine() {
      this.$refs.realtimeChart.updateSeries([{
        data: this.chart_series[0].data,
      }], false, true);
    },

    // convert deck to json file
    deckToJson() {
      let deck_dict = {'main': this.main_card_chosen, 'ex': this.ex_card_chosen};
      const deck_json = JSON.stringify(deck_dict);
      download(deck_json,"deck","application/json");
      console.log(JSON.parse(deck_json));
    },
    readDeck() {
      const files = document.getElementById('selected').files;
      if (files.length <= 0) {
        return false;
      }

      const fr = new FileReader();

      fr.onload = e => {
        const result = JSON.parse(e.target.result);
        //formatted = JSON.stringify(result, null, 2);

        //console.log(result.main);
        this.upload_main = result.main;
        this.upload_ex = result.ex;
        console.log(this.upload_main);
        console.log(this.upload_ex);
        console.log(this.upload_main.length);
      }
      fr.readAsText(files.item(0));

      console.log(this.upload_deck);
      console.log("jizzzzz");
    },
    resetUpload() {
      this.upload_main = [];
      this.upload_ex = [];
    },
    uploadToChosen() {

      // avoid user doesn't click preview button
      const files = document.getElementById('selected').files;
      console.log(files.length);
      this.readDeck();

      setTimeout(() => {
        if(this.upload_main.length || this.upload_ex.length){
          this.main_card_chosen = this.upload_main;
          this.ex_card_chosen = this.upload_ex;
          console.log("write to deck");
        }
      },50);
      
    },
  },
  mounted() {
    this.$bus.$on("add-to-deck",(card) => {
      if(card.cnt == 1){
        // new card just added

        if(card.detail.effect.includes("EXカード")){
          this.ex_card_chosen.push(card);
        } else {
          this.main_card_chosen.push(card);
        }

        console.log(card);
        console.log("added");
      }

      // update color column
      let colorId = this.colorToIndex(card.detail.color);
      this.chart_series[0].data[colorId]++;

      // update modal table
      let typeId = this.cardTypeConvert(card.detail.type);

      if(card.detail.effect.includes("EXカード")){
        // ex cards
        this.items[typeId].source.ex += parseInt(card.detail.source);
        this.items[typeId].cost.ex += parseInt(card.detail.cost);
        this.items[typeId].cards.ex += 1;

        this.items[3].source.ex += parseInt(card.detail.source);
        this.items[3].cost.ex += parseInt(card.detail.cost);
        this.items[3].cards.ex += 1;
      } else {
        // normal cards
        this.items[typeId].source.main += parseInt(card.detail.source);
        this.items[typeId].cost.main += parseInt(card.detail.cost);
        this.items[typeId].cards.main += 1;

        this.items[3].source.main += parseInt(card.detail.source);
        this.items[3].cost.main += parseInt(card.detail.cost);
        this.items[3].cards.main += 1;
      }
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
          for(let i = 0;i < this.main_card_chosen.length;++i){
            if(card.detail.card_number == this.main_card_chosen[i].detail.card_number &&
              card.detail.lines == this.main_card_chosen[i].detail.lines){
                this.main_card_chosen.splice(i,1);
                console.log("deleted");
                break;
              }
          }
        }
          
        console.log(this.main_card_chosen);
      }

      // update color column
      let colorId = this.colorToIndex(card.detail.color);
      this.chart_series[0].data[colorId]--;

      // update modal table
      let typeId = this.cardTypeConvert(card.detail.type);

      if(card.detail.effect.includes("EXカード")){
        // ex cards
        this.items[typeId].source.ex -= parseInt(card.detail.source);
        this.items[typeId].cost.ex -= parseInt(card.detail.cost);
        this.items[typeId].cards.ex -= 1;

        this.items[3].source.ex -= parseInt(card.detail.source);
        this.items[3].cost.ex -= parseInt(card.detail.cost);
        this.items[3].cards.ex -= 1;
      } else {
        // normal cards
        this.items[typeId].source.main -= parseInt(card.detail.source);
        this.items[typeId].cost.main -= parseInt(card.detail.cost);
        this.items[typeId].cards.main -= 1;

        this.items[3].source.main -= parseInt(card.detail.source);
        this.items[3].cost.main -= parseInt(card.detail.cost);
        this.items[3].cards.main -= 1;
      }
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
.not-deck-warning {
  border: 1px #FF2D2D solid;
}
</style>
