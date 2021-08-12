<template>
  <div class="container">

    <b-modal 
      id="point-detail"
      ref="point-modal"
      scrollable
      title="Card-Detail"
      hide-backdrop
      :data="modalData">
      <div class="card-container">
        <img :src="modalData === null ? '../PM_Back.jpg' : modalData.detail.img_url" />
        <div class="card-attr">
          <!--<b-table striped hover :items="modalData === null ? [] : addInArray(modalData.detail)"></b-table>-->

          <table class="table table-striped">
            <tbody>
              <tr>
                <td>
                  <b-button
                    class="btn-line"
                    variant="outline-danger"
                    @click="usePointSource(modalData.order - 1)"
                    >
                    {{card_reset[modalData.order - 1]}}
                  </b-button>
                </td>
              </tr>
              <tr
                v-for="(attr, index) in Object.entries(modalData.detail)"
                :key="attr.card_number"
                >
                <th v-if="showTable(index)">{{attr[0]}}</th>
                <td 
                  :class="textChange.includes(index) ? 'text-danger' : 'text-dark'"
                  v-if="showTable(index)"
                  >
                  {{attr[1]}}
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-modal>

    <draggable
      class="point-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      :emptyInsertThreshold="150"
      @start="drag = true"
      @end="dropTest"
      :move="dropArea"
    >
      <transition-group
        id="points"
        
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          v-for="(element,index) in card_list"
          :key="element.order"
          :class="index == card_list.length - 1 ? 'point last-point rotatem90' : 'point rotatem90' "
          v-b-modal.point-detail
          @click="openModal(element)"
        >
          <!--:style="{backgroundImage : 'url(' + test1 + ')' }"-->
          <div
            class="point-cards"
          >
            <img :src="element.detail.img_url" :style="{opacity: source_used[element.order - 1]}" />
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
    
  </div>
</template>

<script>
import draggable from "vuedraggable";

//const message = ["1", "2", "3", "4", "5", "6", "7"];
const showd = [false,false,false,false,false,false,false,false,false];
const card_used = [1,1,1,1,1,1,1];
const cards_state = ["Use","Use","Use","Use","Use","Use","Use","Use"];

export default {
  name: "points",
  display: "Points",
  order: 6,
  components: {
    draggable,
  },
  data() {
    //const rowofcard = 5;
    //const mapped_list = message.map((name, index) => {
    //  return { name, order: index + 1 };
    //});

    const mydata = require("../data.json");
    //console.log(mydata);
    const tester = mydata.map((detail, index) => {
      return {detail, order: index + 1, excost: 0, exsource: 0, exap: 0, exdp: 0, overlap: []};
    });
    console.log(tester);
    //console.log(tester.slice(0,1));

    return {
      card_list: tester.slice(0,7),
      drag: false,
      modalData: tester[0],
      source_used: card_used,
      card_reset: cards_state,
      showDialog: showd,
      textChange: [],
      test1: require('../PM_Back.jpg'),
      test2: "http://www.p-memories.com/images/product/DNMC3/DNMC3_01-011b.jpg",

      from_which_card: null,
      lastPlace: null,
      lastPlaceId: 0,
      timer: setTimeout(() => {
              this.lastPlace = null;
              console.log("kill last place");
            }),
    };
  },
  methods: {
    openModal(data) {
      console.log("jizz:" + data);
      this.modalData = data;
    },
    // dialog
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

    // modal table
    
    addInArray(data) {
      return [data];
    },
    showTable(id) {
      return (id != 0);
    },
    usePointSource(id) {
      this.source_used = this.source_used.map((el,i) => 
        i === id ? (1.3 - el) : el
      );

      if(this.card_reset[id] == "Reset"){
        this.card_reset.splice(id,1,"Use");
      } else {
        this.card_reset.splice(id,1,"Reset");
      }

      this.$refs["point-modal"].hide();

      console.log(this.source_used);
    },

    // drop
    isStackArea(placeName){
      if(placeName == "decks" || placeName == "discards" || placeName == "ex-decks" || placeName == "excludeds"){
        return false;
      } else {
        return true;
      }
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

      this.lastPlaceId = place.draggedContext.index;
      this.dragCard = place.draggedContext.element;

      return this.isStackArea(place.to.getAttribute("id"));
    },
    dropTest(data) {
      this.drag = false;
      let dropCard = this.dragCard;
      let place = this.lastPlace;

      // ms for re-set properDrop 
      let disable_first_drop = 70;

      // check whether the card is at the same area
      // but its ghost changed the position before it drop

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
              //this.$bus.$emit("add-to-deck-again",dropCard);
              this.$bus.$emit("add-to-again",this.dragCard,place);
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

            //this.$bus.$emit("add-to-deck-again",this.dragCard,data.to.getAttribute("area-name"));

            this.$bus.$emit("add-to-again",this.dragCard,place,data.to.getAttribute("area-name"));

            break;
        }

        console.log("point to deck error");
      }

      this.$bus.$emit("card-stack-to-deck-stack",dropCard,disable_first_drop,place,"point");
      console.log("emit dropCard to deck");

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
  padding: 0;
}
.point-cards {
  padding: 0;
}
.point {
  cursor: move;
  float: left;
  //width: 50%;
  //height: 300px;
  //background-image: url("../PM_Back_Side.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
  padding: 0;
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
}

.rotatem90 {
  //background-image: url("../PM_Back_Side.jpg") 0 0 repeat;
  //background-size: 100%;
  //background-repeat: no-repeat;
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
</style>
