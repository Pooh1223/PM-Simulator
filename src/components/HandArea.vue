<template>
  <div class="container">
    
    <draggable
      class="card-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drop"
      :move="dropArea"
    >
      <transition-group
        id="hands"
        class="row"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        
        <div
          class="item col"
          v-for="(element, index) in card_list"
          :key="'ha-' + index"
          :class = "index % 5 == 0 ? 'item col-2 offset-1' : 'item col-2' "
        >
          <img src="../PM_Back.jpg" />
          <i
            @click="element.fixed = !element.fixed"
            aria-hidden="true"
          >{{index}} , {{element.order}}</i>

        </div>
      </transition-group>
    </draggable>  
    
  </div>
</template>

<script>
import draggable from "vuedraggable";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const message = ["1", "2", "3", "4", "5", "6", "7", "8"];
var startTime , endTime;

export default {
  name: "hand-area",
  display: "hand-area",
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
      text: "I am popover <b>component</b> content!",
      modalData: null,
      lastPlace: null,
      lastPlaceId: 0,
      timer: setTimeout(() => {
              this.lastPlace = null;
              console.log("kill last place");
            },50),
    };
  },
  methods: {
    openModal(data) {
      console.log("jizz:" + data);
      this.modalData = data;
    },
    dropArea(place){
      console.log("move");
      console.log(place);

      clearTimeout(this.timer);

      this.lastPlace = place.to.getAttribute("id");
      
      this.timer = setTimeout(() => {
        this.lastPlace = null;
        console.log("kill last place");
      },50);

      startTime = new Date();

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

      } else {
        return true;
      }
    },
    drop(data) {
      this.drag = false;
      let dropCard = this.dragCard;
      let place = this.lastPlace;
      endTime = new Date();

      console.log("Time elapse: " + Math.round(endTime - startTime));

      // ms for re-set properDrop 
      let disable_first_drop = 70;

      // check whether the card is at the same area
      // but its ghost changed the position before it drop

      //console.log(this.card_list[data.newDraggableIndex] === dropCard);
      //if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
      //  // implies that the dragged card only changes its position in the original area
      //  this.lastPlaceId = data.newDraggableIndex;
      //  console.log("in change id");
      //}

      if(place == "decks") {

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-deck-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
              break;
            case "mains":
              this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",this.dragCard,data.to.getAttribute("area-name"));
              break;
            case "supports":
              this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",this.dragCard,data.to.getAttribute("area-name"));
              break;
            case "points":
              this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",this.dragCard,data.to.getAttribute("area-name"));
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

          console.log("hand to deck error");
        }

        this.$bus.$emit("hand-to-deck",dropCard,disable_first_drop);
        console.log("emit dropCard to deck");

      } else if(place == "discards"){

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              //this.$bus.$emit("cancel-hand-drop",data.newDraggableIndex);

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
            case "mains":
              this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "supports":
              this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));
              break;
            case "points":
              this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-discard-again",dropCard,data.to.getAttribute("area-name"));
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

          console.log("hand to discard error");
        }

        this.$bus.$emit("hand-to-discard",dropCard,disable_first_drop);
        console.log("emit dropCard to discard");

      } else if(place == "ex-decks") {

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
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
              this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
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

          console.log("hand to ex-deck error");
        }

        this.$bus.$emit("hand-to-ex-deck",dropCard,disable_first_drop);
        console.log("emit dropCard to discard");

      } else if(place == "excludeds") {

        if(this.card_list[this.lastPlaceId] != this.dragCard || typeof this.card_list[this.lastPlaceId] == "undefined"){

          disable_first_drop = 0;

          // ghost probably lie in somewhere else

          switch(data.to.getAttribute("id")){
            case "hands":
              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
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
              this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
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

          console.log("hand to excluded error");
        }

        this.$bus.$emit("hand-to-excluded",dropCard,disable_first_drop);
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
  mounted() {
    this.$bus.$on("draw-from-deck",(drawn_card_list) => {
      this.card_list = this.card_list.concat(drawn_card_list);
    });

    this.$bus.$on("check-top-to-hand",(card) => {
      this.card_list.push(card);
    });

    this.$bus.$on("check-bottom-to-hand",(card) => {
      this.card_list.push(card);
    });

    this.$bus.$on("able-to-remove",(where) => {
      if(where == "hand"){
        console.log("lastPlaceId: " + this.lastPlaceId);
        this.card_list.splice(this.lastPlaceId,1);
      }
    });

    this.$bus.$on("cancel-hand-drop",(id) => {
      this.card_list.splice(id,1);
      console.log("cancel hand drop: " + id);
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
  opacity: 1;
  background: #c8ebfb;
}
.sortable-chosen {
  opacity: 1;
}
.card-list {
  min-height: 20px;
  max-width: 100%;
}
.item {
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
.item i {
  cursor: pointer;
}
.item img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}

</style>
