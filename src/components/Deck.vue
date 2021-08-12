<template>
  <div class="container">
      <!--<div class="deck-cards"
        @click="toggleMainDialog">
        <img src="../PM_Back.jpg" />
      </div>-->

      <draggable
        class="deck-list"
        tag="div"
        v-model="card_list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        :move="isLastCard"
        >
        <transition-group
          id="decks"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <div
            class="deck"
            v-for="(element,index) in card_list"
            :key="'de-' + index"
            @mouseenter="stay(dragCard)"
          >
            <div
              class="deck-cards"
              v-if="index == 0"
              @click="toggleMainDialog"
              >
                <img src="../PM_Back.jpg" />
                <i
                  :class="
                    element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                  "
                  @click="element.fixed = !element.fixed"
                  aria-hidden="true"
                ></i>
            </div>
            
          </div>
        </transition-group>
      </draggable>

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
            @click="draw"
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
              @click="shuffle('deck')"
              >
              Shuffle
          </b-button>
        </div>

        <b-form-invalid-feedback id="input-live-feedback">
          Number should be larger than 0
        </b-form-invalid-feedback>

      </dialog-drag>



      <dialog-drag
        id="check_list"
        class="dialog-3"
        :options= "{x: checkDialogX,y: checkDialogY,width: 250}"
        :title="checkTitle"
        v-if="showCheckDialog"
        @drag-start="drag_dialog=true"
        @pin="pinPos"
        @move="posCheckLog"
        @close="toggleCheckDialog"
        >

        <b-button
          variant="outline-primary"
          @click="returnTop"
          style="width: 100%;"
          >
          Return top
        </b-button>
        <b-button
          variant="outline-primary"
          @click="returnBottom"
          style="width: 100%;"
          >
          Return bottom
        </b-button>
        <b-button
          variant="outline-primary"
          @click="shuffle('check')"
          style="width: 100%;"
          >
          Return and Shuffle
        </b-button>

        <draggable
          class="check-card-list"
          tag="div"
          v-model="checkCardList"
          v-bind="dragOptions"
          @start="dragCardStart"
          @end="dragCardEnd"
          :move="disableMove"
        >
          <transition-group
            type="transition"
            :name="!drag ? 'flip-list' : null"
          >
            
            <div
              class="check-item row"
              v-for="(element, index) in checkCardList"
              :key="'chk-' + index"
            >
              <div
                class="check-cards col-6"
                align="center"
                style="height: 100%; display: inline-block;">

                <img src="../PM_Back.jpg" />
                <i
                  :class="
                    element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                  "
                  @click="element.fixed = !element.fixed"
                  aria-hidden="true"
                >{{index}} , {{element.order}}</i>
              </div>
              
              <div
                class="col-6 my-auto"
                style="display: inline-block;"
                >
                <b-button
                  variant="outline-primary"
                  @click="toHand(index)"
                  style="width: 100%;"
                  >
                  Hand
                </b-button>
                <b-button
                  variant="outline-primary"
                  @click="toDiscard(index)"
                  style="width: 100%; padding-left: 0; padding-right: 0;"
                  >
                  Discard
                </b-button>
              </div>

            </div>
          </transition-group>
        </draggable>

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
import draggable from "vuedraggable";
import 'bootstrap/dist/css/bootstrap.css';
import DialogDrag from 'vue-dialog-drag';

export default {
  name: "deck",
  display: "Deck",
  order: 6,
  components: {
    draggable,
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
      drag: false,
      after_drag_card: false,
      properDrop: false,
      dragCard: null,
      addFrom: null,

      card_list: mapped_list,
      showMainDialog: false,
      preText: 2,
      mainDialogX: 500,
      mainDialogY: 500,

      showCheckDialog: false,
      checkDialogX: 550,
      checkDialogY: 550,
      tempDialogX: 0,
      tempDialogY: 0,
      checkTitle: "1",
      checkCardList: [],
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
      //console.log(data);
    },

    // functions in draw option

    draw() {
      let num = this.preText;

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

      this.checkTitle = str;

      switch(str){
        case "Top":
          this.checkTop();
          break;
        case "Bottom":
          this.checkBottom();
          break;
      }

      console.log("check dialog: " + data);
      //console.log(str);
    },
    posCheckLog(data) {
      // track position only when not dragging cards

      if(this.drag == false){
        this.checkDialogX = data.x;
        this.checkDialogY = data.y;
      }

      if(this.after_drag_card == true){
        this.after_drag_card = false;
        this.checkDialogX = this.tempDialogX;
        this.checkDialogY = this.tempDialogY;
      }

      //console.log("move");
      //console.log(data);
      //console.log(this.drag);
      //console.log(this.drag_dialog);
    },
    pinPos(data) {
      console.log(data.pinned);

      // the pinned dialog has a margin around it

      if(data.pinned == true){
        this.checkDialogX -= 48;
        this.checkDialogY -= 48;
      } else {
        this.checkDialogX += 48;
        this.checkDialogY += 48;
      }
      
      console.log("pin");
      console.log(data);
    },
    dragCardStart() {
      this.drag = true;
      this.tempDialogX = this.checkDialogX;
      this.tempDialogY = this.checkDialogY;

      //console.log("start");
      //console.log(this.tempDialogX + " " + this.tempDialogY);
    },
    dragCardEnd() {
      this.drag = false;
      this.checkDialogX = this.tempDialogX;
      this.checkDialogY = this.tempDialogY;

      this.after_drag_card = true;

      //console.log("end");
      //console.log(this.tempDialogX + " " + this.tempDialogY);
    },
    checkTop() {
      let num = this.preText;

      if(num > this.card_list.length){
        num = this.card_list.length;
      }

      this.checkCardList = this.card_list.slice(0,num);
    },
    checkBottom() {
      let num = this.preText;

      if(num > this.card_list.length){
        num = this.card_list.length;
      }

      this.checkCardList = this.card_list.slice(this.card_list.length - num,this.card_list.length);
    },
    toHand(id) {

      let dis_id = this.card_list.length - this.preText + id;
      let selected = this.checkTitle == "Top" ? this.card_list[id] : this.card_list[dis_id];

      switch(this.checkTitle){
        case "Top":
          // remove both check card list and card list
          this.checkCardList.splice(id,1);
          this.card_list.splice(id,1);

          // emit to hand to add card
          this.$bus.$emit("check-top-to-hand",selected);

          break;

        case "Bottom":
          // remove both check card list and card list
          this.checkCardList.splice(id,1);
          this.card_list.splice(id,1);

          // emit to hand to add card
          this.$bus.$emit("check-bottom-to-hand",selected);

          break;
      }
    },
    toDiscard(id) {
      let dis_id = this.card_list.length - this.preText + id;
      let selected = this.checkTitle == "Top" ? this.card_list[id] : this.card_list[dis_id];

      switch(this.checkTitle){
        case "Top":
          // remove both check card list and card list
          this.checkCardList.splice(id,1);
          this.card_list.splice(id,1);

          // emit to hand to add card
          this.$bus.$emit("check-top-to-discard",selected);

          break;

        case "Bottom":
          // remove both check card list and card list
          this.checkCardList.splice(id,1);
          this.card_list.splice(id,1);

          // emit to hand to add card
          this.$bus.$emit("check-bottom-to-discard",selected);

          break;
      }
    },
    returnTop() {
      switch(this.checkTitle){
        case "Top":
          // nothing need to do
          break;
        case "Bottom":
          // shift will pop the first element and return it
          for(let i = 0;i < this.preText;++i){
            this.card_list.unshift(this.card_list.pop());
          }
          break;
      }

      this.toggleCheckDialog();
    },
    returnBottom() {
      switch(this.checkTitle){
        case "Top":
          // shift will pop the first element and return it
          for(let i = 0;i < this.preText;++i){
            this.card_list.push(this.card_list.shift());
          }

          break;
        case "Bottom":
          // nothing need to do
          break;
      }

      this.toggleCheckDialog();
    },
    shuffle(where) {
      for(let i = this.card_list.length - 1;i > 0;--i){
        let j = Math.floor(Math.random() * (i + 1));
        [this.card_list[i],this.card_list[j]] = [this.card_list[j],this.card_list[i]];
      }

      if(where == "check"){
        this.toggleCheckDialog();
      }
    },
    disableMove() {
      return false;
    },
    isLastCard() {
      //if(this.card_list.length == 1) return false;
      //else return true;
      return false;
    },
    stay(card) {
      if(this.properDrop == true){
        this.$bus.$emit("able-to-remove",this.addFrom);
        this.card_list.unshift(card);
        console.log(this.addFrom);
        console.log(card);
        console.log("yes");
      } else {
        console.log("no");
      }
      this.properDrop = false;
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    validDraw() {
      console.log(this.preText);
      return this.preText > 0 ? true : false;
    },
  },
  mounted() {
    this.$bus.$on("add-to-deck",(id,card) => {
      console.log("add card: " + id);
      this.card_list.splice(id,0,card);
    });

    this.$bus.$on("remove-to-deck",(id) => {
      console.log("remove " + id + "-th card");
      this.card_list.splice(id,1);
    });

    // drop

    this.$bus.$on("hand-to-deck",(card,ms) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "hand";

      setTimeout(() => {
        this.properDrop = false;
      },ms);

      console.log("ms: " + ms);
      console.log(this.card_list);
    });

    this.$bus.$on("support-to-deck",(card,ms) => {
      
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "support";
      
      setTimeout(() => {
        this.properDrop = false;
      },ms);

      console.log("ms: " + ms);
      console.log(this.card_list);
    });

    this.$bus.$on("main-to-deck",(card,ms) => {
      
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "main";
      
      setTimeout(() => {
        this.properDrop = false;
      },ms);
      console.log(this.card_list);
    });

    this.$bus.$on("point-to-deck",(card,ms) => {
      
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "point";
      
      setTimeout(() => {
        this.properDrop = false;
      },ms);

      console.log(this.card_list);
    });

    this.$bus.$on("card-stack-to-deck-stack",(card,ms,to,from) => {
      
      if(to == "decks"){
        this.properDrop = true;
        this.dragCard = card;
        this.addFrom = from;
        
        setTimeout(() => {
          this.properDrop = false;
        },ms);

        console.log(this.card_list);
      }
    });

    // cancel
    this.$bus.$on("cancel-stack-drop",(area,id) => {

      if(area == "Deck"){
        console.log("id:" + id);

        this.card_list.splice(id,1);
        this.properDrop = false;
        this.openTemp();
        console.log("deck: delete! " + id);
      }
    });

    // re-add
    this.$bus.$on("add-to-deck-again",(card,area) => {
      this.card_list.unshift(card);
      
      // whether temp need to update 
      if(area == "Deck"){
        this.openTemp();
      }

      this.properDrop = true;
      this.dragCard = card;
      
      setTimeout(() => {
        this.properDrop = false;
      },50);

      console.log("Re-add-to-deck!");
    });

    this.$bus.$on("add-to-again",(card,where,area) => {
      if(where == "decks"){
        this.card_list.unshift(card);
        
        // whether temp need to update 
        if(area == "Deck"){
          this.openTemp();
        }

        this.properDrop = true;
        this.dragCard = card;
        
        setTimeout(() => {
          this.properDrop = false;
        },50);

        console.log("Re-add-to-deck!");
      }
      
    });

  }
};
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.deck {
  cursor: click;
  float: left;
  //width: 50%;
  //height: 300px;
  background-image: url("../PM_Back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
  padding: 1px;
}
.deck img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
.deck-cards {
  padding: 0px;
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
#check_list {
  //overflow-y: auto;
  //overflow: scroll;
}
.check-cards {
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
.check-cards img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}

</style>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/vue-drop-area.css"></style>

<!-- optional dialog styles, see example -->
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>