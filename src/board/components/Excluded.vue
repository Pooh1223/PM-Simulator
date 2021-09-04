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
        id = "excludeds"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          class="excluded"
          v-for="(element,index) in show_list"
          :key="'excl-' + index"
          @mouseenter="stay(dragCard)"
        >
          <div
            class="excluded-cards"
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
    //const message = [];

    //for(let i = 0;i < 8;++i){
    //  message.push(toString(i + 1));
    //}
    
    //const mapped_list = message.map((name, index) => {
    //  return { name, order: index + 1 };
    //});

    return {
      show_list: [1],
      card_list: [],

      drag: false,
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
      this.$bus.$emit("open-temp","Excluded",this.card_list);
      console.log("Excluded: sent!");
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
    this.$bus.$on("add-to-excluded",(id,card) => {
      console.log("add card:" + card);
      this.card_list.splice(id,0,card);
    });

    this.$bus.$on("remove-to-excluded",(id) => {
      console.log("remove " + id + "-th card");
      this.card_list.splice(id,1);
    });

    // drop

    this.$bus.$on("hand-to-excluded",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "hand";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("support-to-excluded",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "support";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("main-to-excluded",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "main";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("point-to-excluded",(card) => {
      this.properDrop = true;
      this.dragCard = card;
      this.addFrom = "point";

      setTimeout(() => {
        this.properDrop = false;
      },50);
      console.log(this.card_list);
    });

    this.$bus.$on("card-stack-to-deck-stack",(card,ms,to,from) => {
      
      if(to == "excludeds"){
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

      if(area == "Excluded"){
        console.log("id:" + id);

        this.card_list.splice(id,1);
        this.properDrop = false;
        this.openTemp();
        console.log("excluded: delete! " + id);
      }
    });

    // re-add
    this.$bus.$on("add-to-excluded-again",(card,area) => {
      this.card_list.unshift(card);
      
      // whether temp need to update 
      if(area == "Excluded"){
        this.openTemp();
      }

      console.log("Re-add-to-excluded!");
    });

    this.$bus.$on("add-to-again",(card,where,area) => {
      if(where == "excludeds"){
        this.card_list.unshift(card);
        
        // whether temp need to update 
        if(area == "Excluded"){
          this.openTemp();
        }

        this.properDrop = true;
        this.dragCard = card;
        
        setTimeout(() => {
          this.properDrop = false;
        },50);

        console.log("Re-add-to-excluded!");
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
.excluded-list {
  min-height: 20px;
  max-width: 100%;
}
.excluded {
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

.excluded-cards {
  padding: 0;
}

.excluded i {
  cursor: pointer;
}
.excluded img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
</style>
