<template>
  <div class="container">
    <draggable
      class="discard-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      :move="isLastCard"
    >
      <transition-group
        id="discards"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          class="discard"
          v-for="(element,index) in card_list"
          :key="'dis-' + index"
          @mouseenter="stay(dragCard)"
        >
          <div
            class="discard-cards"
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
      id="discard-show"
      class="btn-block"
      variant="success"
      @click="openTemp"
      >
      Show all
    </b-button>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "discard",
  display: "Discard",
  order: 6,
  components: {
    draggable,
  },
  data() {
    const message = [];

    for(let i = 0;i < 13;++i){
      message.push(toString(i + 1));
    }
    
    const mapped_list = message.map((name, index) => {
      return { name: String.fromCharCode('a'.charCodeAt(0) + index), order: index + 1 };
    });

    return {
      card_list: mapped_list,
      first_card: mapped_list[0],
      drag: false,

      properDrop: false,
      dragCard: null,
      addFrom: null,
    };
  },
  methods: {

    isLastCard() {
      //if(this.card_list.length == 1) return false;
      //else return true;
      return false;
    },

    openTemp() {
      this.$bus.$emit("open-from-discard","Discard",this.card_list);
      console.log("discard: sent!");
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
    this.$bus.$on("add-to-discard",(id,card) => {
      console.log("add card:" + card);
      this.card_list.splice(id,0,card);
    });

    this.$bus.$on("remove-to-discard",(id) => {
      console.log("remove " + id + "-th card");
      this.card_list.splice(id,1);
    });

    this.$bus.$on("check-top-to-discard",(card) => {
      this.card_list.push(card);
      console.log(this.card_list);
    });

    this.$bus.$on("check-bottom-to-discard",(card) => {
      this.card_list.push(card);
      console.log(this.card_list);
    });

    //drop card

    this.$bus.$on("hand-to-discard",(card,ms) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "hand";

      setTimeout(() => {
        this.properDrop = false;
      },ms);
      console.log(this.card_list);
    });

    this.$bus.$on("support-to-discard",(card,ms) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "support";

      setTimeout(() => {
        this.properDrop = false;
      },ms);

      console.log(this.card_list);
    });

    this.$bus.$on("main-to-discard",(card,ms) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "main";

      setTimeout(() => {
        this.properDrop = false;
      },ms);
      console.log(this.card_list);
    });

    this.$bus.$on("point-to-discard",(card,ms) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "point";

      setTimeout(() => {
        this.properDrop = false;
      },ms);
      console.log(this.card_list);
    });

    this.$bus.$on("card-stack-to-deck-stack",(card,ms,to,from) => {
      
      if(to == "discards"){
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

      if(area == "Discard"){
        console.log("id:" + id);

        this.card_list.splice(id,1);
        this.properDrop = false;
        this.openTemp();
        console.log("discard: delete! " + id);
      }
    });

    // re-add
    this.$bus.$on("add-to-discard-again",(card,area) => {
      this.card_list.unshift(card);
      
      // whether temp need to update 
      if(area == "Discard"){
        this.openTemp();
      }

      console.log("Re-add-to-discard!");
    });


    this.$bus.$on("add-to-again",(card,where,area) => {
      if(where == "discards"){
        this.card_list.unshift(card);
        
        // whether temp need to update 
        if(area == "Discard"){
          this.openTemp();
        }

        this.properDrop = true;
        this.dragCard = card;
        
        setTimeout(() => {
          this.properDrop = false;
        },50);

        console.log("Re-add-to-discard!");
      }
      
    });
  },
  watch: {
    card_list(newVal,oldVal){
      console.log("watch");
      console.log(newVal);
      console.log(oldVal);
    }
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
.discard-list {
  min-height: 20px;
  max-width: 100%;
}
.discard {
  cursor: move;
  float: left;
  //width: 50%;
  //height: 300px;
  background-image: url("../PM_Back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
  padding: 0;
}

.discard-cards {
  padding: 0;
}

.discard i {
  cursor: pointer;
}
.discard img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
</style>
