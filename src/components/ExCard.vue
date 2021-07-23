<template>
  <div class="container">
      <div class="ex-cards"
        @click="openTemp">
        <img src="../PM_Back.jpg" />
      </div>

      <b-button
        id="ex-deck-show"
        class="btn-block"
        variant="success"
        @click="openTemp"
        >
        Show all
      </b-button>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
//import DialogDrag from 'vue-dialog-drag';

export default {
  name: "exdeck",
  display: "ExDeck",
  order: 6,
  components: {
    //DialogDrag,
  },
  data() {
    return {
      showDialog: false,
      preText: 2,
    };
  },
  methods: {
    openTemp() {
      this.$bus.$emit("open-from-ex-deck","Ex-Deck");
      console.log("ex-deck: sent!");
    },
    toggleDialog(data) {
      this.showDialog = !this.showDialog;
      console.log(data);
    },
  },
  computed: {
  },
};
</script>

<style>

.ex-cards {
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
.ex-cards img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
#ex-deck-show {
  padding-bottom: 10px;
  text-align: center;
}

</style>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/vue-drop-area.css"></style>

<!-- optional dialog styles, see example -->
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>