<template>
  <div class="container card_filter">
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

        <b-list-group>
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
                  v-if="element.detail.effect.includes('EXカード') == false"
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
                v-for="element in card_chosen"
                :key="element.detail.card_number"
                style="padding-left: 0px; padding-right: 0px;"
                >

                <img
                  v-if="element.detail.effect.includes('EXカード') == true"
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
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';


export default {
  name: "CardFilter",
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
  },
  mounted() {
    this.$bus.$on("add-to-deck",(card,cnt) => {
      if(cnt == 1){
        // new card just added

        this.card_chosen.push(card);
        console.log("added");
      }
    });

    this.$bus.$on("remove-from-deck",(card,cnt) => {

      if(cnt == 0){
        for(let i = 0;i < this.card_chosen.length;++i){
          if(card.detail.card_number == this.card_chosen[i].detail.card_number &&
            card.detail.lines == this.card_chosen[i].detail.lines){
              this.card_chosen.splice(i,1);
              console.log("deleted");
              break;
            }
        }
        console.log(this.card_chosen);
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
</style>
