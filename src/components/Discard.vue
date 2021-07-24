<template>
  <div class="container">
    <draggable
      class="discard-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      @add="properAdd"
      @remove="properRemove"
      :move="isLastCard"
    >
      <transition-group
        
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          class="discard"
          v-for="(element,index) in card_list"
          :key="'dis-' + index"
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
      return { name, order: index + 1 };
    });

    return {
      card_list: mapped_list,
      first_card: mapped_list[0],
      drag: false,
    };
  },
  methods: {
    properAdd() {
      console.log(this.first_card);

      if(this.first_card == this.card_list[0]){
        // swap 2 element
        [this.card_list[0],this.card_list[1]] = [this.card_list[1],this.card_list[0]];
      }

      this.first_card = this.card_list[0];

      console.log(this.card_list);
    },
    properRemove() {
      console.log("remove");
      this.first_card = this.card_list[0];
    },
    isLastCard() {
      if(this.card_list.length == 1) return false;
      else return true;
    },

    openTemp() {
      this.$bus.$emit("open-from-discard","Discard",this.card_list);
      console.log("discard: sent!");
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
