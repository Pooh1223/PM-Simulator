<template>
  <div class="container">
    <b-modal 
      id="card-detail"
      scrollable
      title="Card-Detail"
      hide-backdrop
      :data="modalData">
      <div class="card-container">
        <img src="../PM_Back.jpg" />
        <div class="card-attr">
          <p class="my-2">
            Test ,Test {{modalData}}
          </p>
        </div>
      </div>
    </b-modal>
    <draggable
      class="support-card-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      :emptyInsertThreshold="150"
      @start="drag = true"
      @end="drop"
      :move="dropArea"
    >
      <transition-group
        id="supports"
        class="row"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        
        <div
          :class = "index % 5 == 0 ? 'item col-2 offset-1' : 'item col-2' "
          v-for="(element, index) in card_list"
          :key="'ma-' + index"
          v-b-modal.card-detail
          @click="openModal(element.order)"
        >
          <img src="../PM_Back.jpg" />
          <i
            :class="
              element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
            "
            @click="element.fixed = !element.fixed"
            aria-hidden="true"
          >{{index}} , {{element.order}}</i>

          <draggable
            class="overlap-card-list"
            tag="div"
            v-model="card_list"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            v-if="showDialog[element.order]"
          >
            <transition-group
              class="row"
              type="transition"
              :name="!drag ? 'flip-list' : null"
              style="margin:auto;"
            >
              
              <div
                class="item col-md-6" 
                v-for="element in card_list"
                :key="element.order"
                v-b-modal.card-detail
                @click="openModal(element.order)"
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
            </transition-group>
          </draggable>

          <div class="text-center">
            <b-button
              id="overlap"
              variant="outline-primary"
              @click.stop="openDialog(element.order)">
              Overlap
            </b-button>
          </div>
        </div>
      </transition-group>
    </draggable>  
    
  </div>
</template>

<script>
import draggable from "vuedraggable";
//import DialogDrag from 'vue-dialog-drag';
//import DropArea from 'vue-dialog-drag/dist/drop-area';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const message = ["1", "2", "3", "4", "5", "6", "7", "8"];
const showd = [false,false,false,false,false,false,false,false];

export default {
  name: "main-area",
  display: "main-area",
  order: 6,
  components: {
    draggable,
    //DialogDrag,
    //DropArea,
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
      modalData: null,
      showDialog: showd,
      from_which_card: null,
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
    openDialog (data) {
      //this.showDialog[data] = !this.showDialog[data];
      // vue can't detect an element changed or not in an array
      this.showDialog = this.showDialog.map((el,i) => 
        i === data ? !el : el
      );
      this.from_which_card = data;
      console.log("it should open!");
      console.log(this.card_list);
      console.log(this.showDialog);
    },
    closeDialog () {
      this.showDialog = false;
      console.log("it should close!");
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
              //this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-deck-again",dropCard);
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
              break;
            case "points":
              this.$bus.$emit("cancel-point-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",dropCard,data.to.getAttribute("area-name"));
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

          console.log("support to deck error");
        }

        this.$bus.$emit("support-to-deck",dropCard,disable_first_drop);
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
              //this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);

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

          console.log("support to discard error");
        }

        this.$bus.$emit("support-to-discard",dropCard,disable_first_drop);
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
              //this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
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

          console.log("support to ex-deck error");
        }

        this.$bus.$emit("support-to-ex-deck",dropCard,disable_first_drop);
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
              //this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
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

          console.log("support to excluded error");
        }

        this.$bus.$emit("support-to-excluded",dropCard,disable_first_drop);
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
    this.$bus.$on("able-to-remove",(where) => {
      if(where == "support"){
        this.card_list.splice(this.lastPlaceId,1);
      }
    });

    this.$bus.$on("cancel-support-drop",(id) => {
      this.card_list.splice(id,1);
      console.log("cancel support drop:" + id);
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
.support-card-list {
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
#overlap {
  margin-bottom: 5px;
}
.card-container {
  overflow-y: auto;
}
.card-container img {
  vertical-align: top;
  max-width: 100%;
}
.overlap-card-list {
  min-height: 20px;
  max-width: 100%;
  //overflow-y: auto;
  //padding-right: 10px;
  //padding-left: 10px;
  box-sizing: border-box;
}
</style>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/vue-drop-area.css"></style>

<!-- optional dialog styles, see example -->
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>