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
      lastPlace: null,
      lastPlaceId: 0,
      timer: setTimeout(() => {
              this.lastPlace = null;
              console.log("kill last place");
            }),
    };
  },
  methods: {
    dropArea(place){
      console.log("move");
      console.log(place);

      clearTimeout(this.timer);

      this.lastPlace = place.to.getAttribute("id");
      
      this.timer = setTimeout(() => {
        this.lastPlace = null;
        console.log("kill last place");
      },50);

      if(place.to.getAttribute("id") == "decks"){

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return false;

      } else if(place.to.getAttribute("id") == "discards"){

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return false;

      } else if(place.to.getAttribute("id") == "ex-decks"){

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return false;

      } else if(place.to.getAttribute("id") == "excludeds"){

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return false;

      } else if(place.to.getAttribute("id") == "hands"){

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return true;

      } else if(place.to.getAttribute("id") == "mains"){

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return true;
      } else if(place.to.getAttribute("id") == "supports") {

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return true;
      } else if(place.to.getAttribute("id") == "points"){

        this.lastPlaceId = place.draggedContext.index;
        this.dragCard = place.draggedContext.element;
        return true;
      } else {
        return true;
      }
      
    },
    drop(data) {
      this.drag = false;
      let dropCard = this.dragCard;
      let place = this.lastPlace;

      // ms for re-set properDrop 
      let disable_first_drop = 70;

      // check whether the card is at the same area
      // but its ghost changed the position before it drop

      if(place == "decks") {

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              this.$bus.$emit("cancel-hand-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",this.dragCard,data.to.getAttribute("area-name"));
              break;
            case "mains":
              this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "supports":
              this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",dropCard,data.to.getAttribute("area-name")); 
              break;
            case "points":
              //this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              //this.$bus.$emit("add-to-deck-again",dropCard,data.to.getAttribute("area-name"));

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-deck-again",dropCard);
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
              break;
            case "temp-area":
              // special case: it will affect deck-stack area too
              //this.$bus.$emit("cancel-temp-drop",data.newDraggableIndex);

              // args_1: where, args_2: index
              this.$bus.$emit("cancel-stack-drop",data.to.getAttribute("area-name"),data.newDraggableIndex);

              // case when temp area is the same with stack
              // since we use openTemp to refresh the list
              // need to check whether the area-name is same with lastPlace

              this.$bus.$emit("add-to-deck-again",this.dragCard,data.to.getAttribute("area-name"));

              break;
          }

          console.log("point to deck error");
        }

        this.$bus.$emit("point-to-deck",dropCard,disable_first_drop);
        console.log("emit dropCard to deck");

      } else if(place == "discards"){

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              this.$bus.$emit("cancel-hand-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "mains":
              this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "supports":
              this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));

              break;
            case "points":
              //this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              //this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));

              // since you change the ghost position before drop to stack
              // it might cause error since the lastPlaceId is no longer the same

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
              break;
            case "temp-area":
              // special case: it will affect deck-stack area too
              //this.$bus.$emit("cancel-temp-drop",data.newDraggableIndex);

              // args_1: where, args_2: index
              this.$bus.$emit("cancel-stack-drop",data.to.getAttribute("area-name"),data.newDraggableIndex);

              // case when temp area is the same with stack
              // since we use openTemp to refresh the list
              // need to check whether the area-name is same with lastPlace

              this.$bus.$emit("add-to-discard-again",this.dragCard,data.to.getAttribute("area-name"));

              break;
          }

          console.log("point to discard error");
        }

        this.$bus.$emit("point-to-discard",dropCard,disable_first_drop);
        console.log("emit dropCard to discard");

      } else if(place == "ex-decks") {

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              this.$bus.$emit("cancel-hand-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "mains":
              this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "supports":
              this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
              
              break;
            case "points":
              //this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              //this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
              break;
            case "temp-area":
              // special case: it will affect deck-stack area too
              //this.$bus.$emit("cancel-temp-drop",data.newDraggableIndex);

              // args_1: where, args_2: index
              this.$bus.$emit("cancel-stack-drop",data.to.getAttribute("area-name"),data.newDraggableIndex);

              // case when temp area is the same with stack
              // since we use openTemp to refresh the list
              // need to check whether the area-name is same with lastPlace

              this.$bus.$emit("add-to-ex-deck-again",this.dragCard,data.to.getAttribute("area-name"));

              break;
          }

          console.log("point to ex-deck error");
        }

        this.$bus.$emit("point-to-ex-deck",dropCard,disable_first_drop);
        console.log("emit dropCard to discard");

      } else if(place == "excludeds") {

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              this.$bus.$emit("cancel-hand-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "mains":
              this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "supports":
              this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "points":
              //this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              //this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
              break;
            case "temp-area":
              // special case: it will affect deck-stack area too
              //this.$bus.$emit("cancel-temp-drop",data.newDraggableIndex);

              // args_1: where, args_2: index
              this.$bus.$emit("cancel-stack-drop",data.to.getAttribute("area-name"),data.newDraggableIndex);

              // case when temp area is the same with stack
              // since we use openTemp to refresh the list
              // need to check whether the area-name is same with lastPlace

              this.$bus.$emit("add-to-excluded-again",this.dragCard,data.to.getAttribute("area-name"));

              break;
          }

          console.log("point to excluded error");
        }

        this.$bus.$emit("point-to-excluded",dropCard,disable_first_drop);
      }

      console.log("test");
      console.log(place);
      console.log(this.lastPlace);
      console.log(data);
      console.log(data.to);
      console.log(data.to.getAttribute("area-name"));
      console.log(data.from);
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

    this.$bus.$on("cancel-point-drop",(id) => {
      this.card_list.splice(id,1);
      console.log("cancel point drop: " + id);
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
