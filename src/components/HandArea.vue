<template>
  <div class="container">
    
    <b-modal 
      id="hand-detail"
      scrollable
      title="Card-Detail"
      hide-backdrop
      >
      <div class="card-container">
        <img :src="modalData === null ? '../PM_Back.jpg' : modalData.detail.img_url" />
        <div class="card-attr">
          <!--<b-table striped hover :items="modalData === null ? [] : addInArray(modalData.detail)"></b-table>-->

          <table class="table table-striped">
            <tbody>
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
                <td>
                  <b-button
                    class="btn-line"
                    variant="outline-danger"
                    v-if="showTable(index) && showTableBtn(index)"
                    @click="addTableValue(index,attr[0])"
                    >
                    +
                  </b-button>
                </td>
                <td>
                  <b-button
                    class="btn-line"
                    variant="outline-danger"
                    v-if="showTable(index) && showTableBtn(index)"
                    @click="minusTableValue(index,attr[0])"
                    >
                    -
                  </b-button>
                </td>
                <td>
                  <b-button
                    class="btn-line"
                    variant="outline-danger"
                    v-if="showTable(index) && showTableBtn(index)"
                    @click="resetTableValue(index,attr[0])"
                    >
                    Reset
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-modal>

    <draggable
      class="card-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      :emptyInsertThreshold="150"
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
          class="hand-item col"
          v-for="(element, index) in card_list"
          :key="'ha-' + index"
          :class = "index % 5 == 0 ? 'hand-item col-2 offset-1' : 'hand-item col-2' "
          v-b-modal.hand-detail
          @click="openModal(element)"
          :style="{backgroundImage: 'url(' + element.detail.img_url + ')' }"
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
      return { name, order: index + 1};
    });
    console.log(mapped_list);

    const mydata = require("../data.json");
    console.log(mydata);
    const tester = mydata.map((detail, index) => {
      return {detail, order: index + 1, excost: 0, exsource: 0, exap: 0, exdp: 0};
    });
    console.log(tester);
    //console.log(tester.slice(0,1));

    return {
      row_of_card: rowofcard,
      card_list: tester.slice(0,8),
      drag: false,

      modalData: tester[0],
      lastPlace: null,
      lastPlaceId: 0,
      timer: setTimeout(() => {
              this.lastPlace = null;
              console.log("kill last place");
            },50),

      textChange: [],
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

    // modal table
    addInArray(data) {
      return [data];
    },
    showTable(id) {
      return (id != 0);
    },
    showTableBtn(id) {
      return (id == 6 || id == 7 || id == 10 || id == 11);
    },

    // modify table value

    // 6 is the index of cost property in detail
    // 7 is the index of source property in detail
    // 10 is the index of AP property in detail
    // 11 is the index of DP property in detail

    addTableValue(index, col) {
      switch(col){
        case "cost":
          this.modalData.excost += 1;
          this.modalData.detail.cost = parseInt(this.modalData.detail.cost) + 1;
          
          if(this.modalData.excost == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.cost = parseInt(this.modalData.detail.cost) - parseInt(this.modalData.excost);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
        case "source":
          this.modalData.exsource += 1;
          this.modalData.detail.source = parseInt(this.modalData.detail.source) + 1;
          
          if(this.modalData.exsource == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.source = parseInt(this.modalData.detail.source) - parseInt(this.modalData.exsource);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
        case "AP":
          this.modalData.exap += 10;
          this.modalData.detail.AP = parseInt(this.modalData.detail.AP) + 10;
          
          if(this.modalData.exap == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.AP = parseInt(this.modalData.detail.AP) - parseInt(this.modalData.exap);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
        case "DP":
          this.modalData.exdp += 10;
          this.modalData.detail.DP = parseInt(this.modalData.detail.DP) + 10;
          
          if(this.modalData.exdp == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.DP = parseInt(this.modalData.detail.DP) - parseInt(this.modalData.exdp);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
      }
    },
    minusTableValue(index, col) {
      switch(col){
        case "cost":
          this.modalData.excost -= 1;
          this.modalData.detail.cost = parseInt(this.modalData.detail.cost) - 1;
          
          if(this.modalData.excost == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.cost = parseInt(this.modalData.detail.cost) - parseInt(this.modalData.excost);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
        case "source":
          this.modalData.exsource -= 1;
          this.modalData.detail.source = parseInt(this.modalData.detail.source) - 1;
          
          if(this.modalData.exsource == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.source = parseInt(this.modalData.detail.source) - parseInt(this.modalData.exsource);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
        case "AP":
          this.modalData.exap -= 10;
          this.modalData.detail.AP = parseInt(this.modalData.detail.AP) - 10;
          
          if(this.modalData.exap == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.AP = parseInt(this.modalData.detail.AP) - parseInt(this.modalData.exap);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
        case "DP":
          this.modalData.exdp -= 10;
          this.modalData.detail.DP = parseInt(this.modalData.detail.DP) - 10;
          
          if(this.modalData.exdp == 0){
            let id = this.textChange.indexOf(index);
            if(id > -1){
              this.textChange.splice(id,1);
            }
            this.modalData.detail.DP = parseInt(this.modalData.detail.DP) - parseInt(this.modalData.exdp);
          } else {
            if(this.textChange.includes(index) == false){
              this.textChange.push(index);
            }
          }
          break;
      }
    },
    resetTableValue(index, col) {

      let id = this.textChange.indexOf(index);
      if(id > -1){
        this.textChange.splice(id,1);
      }

      switch(col){
        case "cost":
          this.modalData.detail.cost = parseInt(this.modalData.detail.cost) - parseInt(this.modalData.excost);
          this.modalData.excost = 0;
          
          break;
        case "source":
          this.modalData.detail.source = parseInt(this.modalData.detail.source) - parseInt(this.modalData.exsource);
          this.modalData.exsource = 0;
          
          break;
        case "AP":
          this.modalData.detail.AP = parseInt(this.modalData.detail.AP) - parseInt(this.modalData.exap);
          this.modalData.exap = 0;
          
          break;
        case "DP":
          this.modalData.detail.DP = parseInt(this.modalData.detail.DP) - parseInt(this.modalData.exdp);
          this.modalData.exdp = 0;

          break;
      }

      console.log(this.textChange);
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
    }
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
.hand-item {
  cursor: move;
  float: left;
  //width: 50%;
  //height: 300px;
  //background-image: url("../PM_Back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
  padding: 0;
}
.hand-item i {
  cursor: pointer;
}
.hand-item img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}

</style>
