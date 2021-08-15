<template>
  <div class="container">
      <!--<div class="ex-cards"
        @click="openTemp">
        <img src="../PM_Back.jpg" />
      </div>-->

      <draggable
        class="ex-deck-list"
        tag="div"
        v-model="card_list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        :move="isLastCard"
        >
        <transition-group
          id="ex-decks"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <div
            class="ex-deck"
            v-for="(element,index) in card_list"
            :key="'de-' + index"
            @mouseenter="stay(dragCard)"
          >
            <div
              class="ex-cards"
              v-if="index == 0"
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
import draggable from "vuedraggable";
//import DialogDrag from 'vue-dialog-drag';

export default {
  name: "exdeck",
  display: "ExDeck",
  order: 6,
  components: {
    draggable,
    //DialogDrag,
  },
  data() {
    const message = [];

    for(let i = 0;i < 15;++i){
      message.push(toString(i + 1));
    }
    
    const mapped_list = message.map((name, index) => {
      return { name, order: index + 1 };
    });

    return {
      drag: false,
      card_list: mapped_list,
      showDialog: false,
      preText: 2,
      properDrop: false,
      dragCard: null,
      addFrom: null,
    };
  },
  methods: {
    isLastCard() {
      return false;
    },
    openTemp() {
      this.$bus.$emit("open-from-ex-deck","Ex-Deck",this.card_list);
      console.log("ex-deck: sent!");
    },
    toggleDialog(data) {
      this.showDialog = !this.showDialog;
      console.log(data);
    },
    stay(card) {
      if(this.properDrop == true){
        this.$bus.$emit("able-to-remove",this.addFrom);
        this.card_list.unshift(card);
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
  },
  mounted() {
    this.$bus.$on("add-to-ex-deck",(id,card) => {
      console.log("add card:" + card);
      this.card_list.splice(id,0,card);
    });

    this.$bus.$on("remove-to-ex-deck",(id) => {
      console.log("remove " + id + "-th card");
      this.card_list.splice(id,1);
    });

    // drop

    this.$bus.$on("hand-to-ex-deck",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "hand";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("support-to-ex-deck",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "support";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("main-to-ex-deck",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "main";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("point-to-ex-deck",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "point";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("card-stack-to-deck-stack",(card,ms,to,from) => {
      
      if(to == "ex-decks"){
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

      if(area == "Ex-Deck"){
        console.log("id:" + id);

        this.card_list.splice(id,1);
        this.properDrop = false;
        this.openTemp();
        console.log("ex-deck: delete! " + id);
      }
    });

    // re-add
    this.$bus.$on("add-to-ex-deck-again",(card,area) => {
      this.card_list.unshift(card);
      
      // whether temp need to update 
      if(area == "Ex-Deck"){
        this.openTemp();
      }

      console.log("Re-add-to-ex-deck!");
    });

    this.$bus.$on("add-to-again",(card,where,area) => {
      if(where == "ex-decks"){
        this.card_list.unshift(card);
        
        // whether temp need to update 
        if(area == "Ex-Deck"){
          this.openTemp();
        }

        this.properDrop = true;
        this.dragCard = card;
        
        setTimeout(() => {
          this.properDrop = false;
        },50);

        console.log("Re-add-to-ex-deck!");
      }
      
    });
  }
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