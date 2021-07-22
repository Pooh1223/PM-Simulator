<template>
  <div class="container">
      <div class="deck-cards"
        @click="openTemp">
        <img src="../PM_Back.jpg" />
      </div>

      <dialog-drag 
        id="dialog-1"
        :options= "{x: 100,y: 100, buttonPin: false}"
        title="Options"
        v-if="showDialog"
        @close="toggleDialog">

        <div style="display:inline-block;">
          <b-form-input
            v-model="preText"
            type="number"
            placeholder="number you want to draw"
            :state="validDraw"
            >
          </b-form-input>
        </div>
        <div style="display:inline-block;">
          <b-button
            :disabled="preText <= 0"
            variant="outline-danger"
            style="display:inline-block;"
            >
            Draw
          </b-button>
        </div>

        <div>
          <b-button
              variant="outline-danger"
              >
              Check top
          </b-button>
          <b-button
              variant="outline-danger"
              >
              Check bottom
          </b-button>
          <b-button
              variant="outline-danger"
              >
              Shuffle
          </b-button>
        </div>
        
        <b-form-invalid-feedback id="input-live-feedback">
          Number should be larger than 0
        </b-form-invalid-feedback>

      </dialog-drag>

      <b-button
        id="deck-draw"
        class="btn-block"
        variant="success"
        @click="toggleDialog"
        >
        Draw
      </b-button>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import DialogDrag from 'vue-dialog-drag';

export default {
  name: "deck",
  display: "Deck",
  order: 6,
  components: {
    DialogDrag,
  },
  data() {
    return {
      showDialog: false,
      preText: 2,
      test: "true",
    };
  },
  methods: {
    openTemp() {
      this.$bus.$emit("open-from-deck","Deck");
      console.log("deck: sent!");
    },
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
  },
  computed: {
    validDraw() {
      console.log(this.preText);
      return this.preText > 0 ? true : false;
    }
  },
};
</script>

<style>

.deck-cards {
  cursor: click;
  float: left;
  //width: 50%;
  //height: 300px;
  background-image: url("../PM_Back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
  padding-bottom: 5px;
}
.deck-cards img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
#deck-draw {
  padding-bottom: 10px;
  text-align: center;
}
#deck-opt {
  text-align: center;
}

</style>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/vue-drop-area.css"></style>

<!-- optional dialog styles, see example -->
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>