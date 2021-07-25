<template>
  <div class="container">
      <div class="deck-cards"
        @click="toggleMainDialog">
        <img src="../PM_Back.jpg" />
      </div>

      <dialog-drag 
        id="dialog-1"
        :options= "{x: mainDialogX,y: mainDialogY}"
        title="Options"
        v-if="showMainDialog"
        @move="posMainLog"
        @close="toggleMainDialog">

        <b-form-input
          v-model="preText"
          type="number"
          placeholder="number you want to draw"
          :state="validDraw"
          @click.stop="shout"
          >
        </b-form-input>
        <div style="display:inline-block;">
          <b-button
            class="btn-line"
            :disabled="preText <= 0"
            variant="outline-danger"
            @click="draw(preText)"
            >
            Draw
          </b-button>
          <b-button
            class="btn-line"
            :disabled="preText <= 0"
            variant="outline-danger"
            @click="toggleCheckDialog($event,'Top')"
            >
              Check top
          </b-button>
          <b-button
            class="btn-line"
            :disabled="preText <= 0"
            variant="outline-danger"
            @click="toggleCheckDialog($event,'Bottom')"
            >
              Check bottom
          </b-button>
        </div>

        <div>
          <b-button
              variant="outline-danger"
              @click="shuffle"
              >
              Shuffle
          </b-button>
        </div>

        <b-form-invalid-feedback id="input-live-feedback">
          Number should be larger than 0
        </b-form-invalid-feedback>

      </dialog-drag>

      <dialog-drag
        id="dialog-1"
        class="dialog-3"
        :options= "{x: checkDialogX,y: checkDialogY}"
        title="Options"
        v-if="showCheckDialog"
        @pin="pinPos"
        @drag-end="posCheckLog"
        @close="toggleCheckDialog"
        >
      </dialog-drag>

      <b-button
        id="deck-draw"
        class="btn-block"
        variant="success"
        @click="openTemp"
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
    const message = [];

    for(let i = 0;i < 25;++i){
      message.push(toString(i + 1));
    }
    
    const mapped_list = message.map((name, index) => {
      return { name, order: index + 1 };
    });

    return {
      card_list: mapped_list,
      showMainDialog: false,
      showCheckDialog: false,
      preText: 2,
      mainDialogX: 500,
      mainDialogY: 500,
      checkDialogX: 550,
      checkDialogY: 550,
    };
  },
  methods: {
    openTemp() {
      this.$bus.$emit("open-from-deck","Deck",this.card_list);
      console.log("deck: sent!");
    },
    toggleMainDialog(data) {
      this.showMainDialog = !this.showMainDialog;
      console.log(data);
    },
    posMainLog(data) {
      this.mainDialogX = data.x;
      this.mainDialogY = data.y;
      console.log(data);
    },

    // functions in draw option

    draw(num) {

      if(num > this.card_list.length){
        num = this.card_list.length;
      }

      let temp_card_list = [];

      for(let i = 0;i < num;++i){
        temp_card_list.push(this.card_list[i]);
      }

      this.card_list.splice(0,num);

      this.$bus.$emit("draw-from-deck",temp_card_list);
    },
    toggleCheckDialog(data,str) {
      this.showCheckDialog = !this.showCheckDialog;
      console.log(data);
      console.log(str);
    },
    posCheckLog(data) {
      this.checkDialogX = data.x;
      this.checkDialogY = data.y;
      console.log(data);
    },
    pinPos(data) {
      console.log(data.pinned);
      
      if(data.pinned == true){
        this.checkDialogX -= 48;
        this.checkDialogY -= 48;
      } else {
        this.checkDialogX += 48;
        this.checkDialogY += 48;
      }
      
      console.log(data);
    },
    checkTop() {

    },
    checkBottom() {

    },
    shuffle() {
      for(let i = this.card_list.length - 1;i > 0;--i){
        let j = Math.floor(Math.random() * (i + 1));
        [this.card_list[i],this.card_list[j]] = [this.card_list[j],this.card_list[i]];
      }
    }
  },
  computed: {
    validDraw() {
      console.log(this.preText);
      return this.preText > 0 ? true : false;
    }
  },
  mounted() {
    this.$bus.$on("add-to-deck",(id,card) => {
      console.log("add card:" + card);
      this.card_list.splice(id,0,card);
    });

    this.$bus.$on("remove-to-deck",(id) => {
      console.log("remove " + id + "-th card");
      this.card_list.splice(id,1);
    });
  }
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

.btn-line {
  margin-right: 2px;
}

</style>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/vue-drop-area.css"></style>

<!-- optional dialog styles, see example -->
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>