<template>
  <div class="container">
    <draggable
      class="point-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drop"
      :move="dropArea"
    >
      <transition-group
        id="points"
        class="row"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          
          v-for="(element,index) in card_list"
          :key="element.order"
          :class="index == card_list.length - 1 ? 'point last-point' : 'point'"
        >
          <div
            class="point-cards col"
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
          <div class="w-100"></div>
        </div>
      </transition-group>
    </draggable>
    
  </div>
</template>

<script>
import draggable from "vuedraggable";

const message = ["1", "2", "3", "4", "5", "6", "7"];
export default {
  name: "points",
  display: "Points",
  order: 6,
  components: {
    draggable,
  },
  data() {
    const rowofcard = 5;
    const mapped_list = message.map((name, index) => {
      return { name, order: index + 1 };
    });

    return {
      row_of_card: rowofcard,
      card_list: mapped_list,
      drag: false,
    };
  },
  methods: {
    dropArea(place){
      console.log("move");
      console.log(place);

      this.lastPlace = place.to.getAttribute("id");

      if(place.to.getAttribute("id") == "decks"){

        this.lastPlaceId = place.draggedContext.index;
        return false;

      } else if(place.to.getAttribute("id") == "discards"){

        this.lastPlaceId = place.draggedContext.index;
        return false;

      } else if(place.to.getAttribute("id") == "ex-decks"){

        this.lastPlaceId = place.draggedContext.index;
        return false;

      } else if(place.to.getAttribute("id") == "excludeds"){

        this.lastPlaceId = place.draggedContext.index;
        return false;

      } else if(place.to.getAttribute("id") == "hands"){

        this.lastPlaceId = place.draggedContext.index;
        return true;

      } else {
        return true;
      }
    },
    drop(data) {
      this.drag = false;

      if(this.lastPlace == "decks") {

        let dropCard = this.card_list[this.lastPlaceId];
        this.$bus.$emit("hand-to-deck",dropCard);

      } else if(this.lastPlace == "discards"){

        let dropCard = this.card_list[this.lastPlaceId];
        this.$bus.$emit("hand-to-discard",dropCard);

      } else if(this.lastPlace == "ex-decks") {

        let dropCard = this.card_list[this.lastPlaceId];
        this.$bus.$emit("hand-to-ex-deck",dropCard);

      } else if(this.lastPlace == "excludeds") {

        let dropCard = this.card_list[this.lastPlaceId];
        this.$bus.$emit("hand-to-excluded",dropCard);
        
      }

      console.log("test");
      console.log(data);
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
  mount() {
    this.$bus.$on("able-to-remove",(where) => {
      if(where == "point"){
        this.card_list.splice(this.lastPlaceId,1);
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
.point-list {
  min-height: 20px;
  max-width: 100%;
}
.point {
  cursor: move;
  float: left;
  //width: 50%;
  //height: 300px;
  background-image: url("../PM_Back_Side.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
}
.last-point {
  padding: 0;
}

.point i {
  cursor: pointer;
}
.point img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
</style>
