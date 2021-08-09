<template>
  <div class="container">

    <b-modal 
      id="main-detail"
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
        id="mains"
        class="row"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        
        <div
          v-for="(element, index) in card_list"
          :key="'ma-' + index"
          :class = "index % 5 == 0 ? 'main-item col-2 offset-1' : 'main-item col-2' "
          v-b-modal.main-detail
          @click="openModal(element.order)"
          :style="{backgroundImage: 'url(' + require('../' + card_bgimg[element.order - 1]) + ')' }"
        >
          <img :src="require('../' + card_bgimg[element.order - 1])" />
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
                class="main-item col-md-6" 
                v-for="element in card_list"
                :key="element.order"
                v-b-modal.main-detail
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
              @click.stop="toggleDialog(element.order)">
              Overlap
            </b-button>
            <b-button
              id="rest"
              variant="outline-primary"
              @click.stop="toggleRotateCard(element.order - 1)">
              {{card_rest[element.order - 1]}}
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
const showd = [false,false,false,false,false,false,false,false,false];
const cimg = ["PM_Back.jpg","PM_Back.jpg","PM_Back.jpg","PM_Back.jpg","PM_Back.jpg","PM_Back.jpg","PM_Back.jpg","PM_Back.jpg"];
const cards_state = ["Rest","Rest","Rest","Rest","Rest","Rest","Rest","Rest"];

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
    const mapped_list = message.map((name, index) => {
      return { name, order: index + 1 };
    });

    const mydata = require("../data.json");
    console.log(mydata);
    const tester = mydata.map((detail, index) => {
      return {detail, order: index + 1, excost: 0, exsource: 0, exap: 0, exdp: 0};
    });
    console.log(tester);
    //console.log(tester.slice(0,1));

    return {
      drag: false,
      card_list: mapped_list,
      card_bgimg: cimg,
      card_rest: cards_state,
      textChange: [],

      modalData: tester[0],
      showDialog: showd,
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

    toggleDialog (id) {
      //this.showDialog[id] = !this.showDialog[id];
      // vue can't detect an element changed or not in an array
      this.showDialog = this.showDialog.map((el,i) => 
        i === id ? !el : el
      );
      this.from_which_card = id;
      console.log("it should open!");
      console.log(this.card_list);
      console.log(this.showDialog);
    },
    toggleRotateCard(id) {
      if(this.card_bgimg[id].includes('Side')){
        // remove

        this.card_bgimg.splice(id,1,"PM_Back.jpg");
        this.card_rest.splice(id,1,"Rest");

        console.log("rotate back!");
        console.log(this.card_bgimg);
      } else {
        // add

        this.card_bgimg.splice(id,1,"PM_Back_Side.jpg");
        this.card_rest.splice(id,1,"Stand");

        console.log("rotate!");
        console.log(this.card_bgimg);
      }
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

    // drop

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
              //this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              //this.$bus.$emit("add-to-deck-again",dropCard,data.to.getAttribute("area-name"));

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-deck-again",dropCard);
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
              break;
            case "supports":
              this.$bus.$emit("cancel-support-drop",data.newDraggableIndex);
              this.$bus.$emit("add-to-deck-again",dropCard,data.to.getAttribute("area-name")); 
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

          console.log("main to deck error");
        }

        this.$bus.$emit("main-to-deck",dropCard,disable_first_drop);
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
              //this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
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

          console.log("main to discard error");
        }

        this.$bus.$emit("main-to-discard",dropCard,disable_first_drop);
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
              //this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              //this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-ex-deck-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
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

          console.log("main to ex-deck error");
        }

        this.$bus.$emit("main-to-ex-deck",dropCard,disable_first_drop);
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
              //this.$bus.$emit("cancel-main-drop",data.newDraggableIndex);
              //this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));

              if(data.to === data.from && this.card_list[data.newDraggableIndex] === dropCard){
                // implies that the dragged card only changes its position in the original area
                
                this.lastPlaceId = data.newDraggableIndex;
                this.$bus.$emit("add-to-excluded-again",dropCard,data.to.getAttribute("area-name"));
                this.card_list.splice(this.lastPlaceId,1);
                console.log("in change id");
              }
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

          console.log("main to excluded error");
        }

        this.$bus.$emit("main-to-excluded",dropCard,disable_first_drop);
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
      if(where == "main"){
        this.card_list.splice(this.lastPlaceId,1);
      }
    });

    this.$bus.$on("cancel-main-drop",(id) => {
      this.card_list.splice(id,1);
      console.log("cancel main drop: " + id);
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
.card-list {
  min-height: 20px;
  max-width: 100%;
}
.main-item {
  cursor: move;
  float: left;
  //width: 50%;
  //height: 300px;
  background-image: url("../PM_Back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
  padding: 0;
  overflow: hidden;
}
.main-item i {
  cursor: pointer;
}
.main-item img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
#overlap {
  width: 90%;
  margin-bottom: 5px;
}
#rest {
  width: 90%;
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
  overflow-y: auto;
  //padding-right: 10px;
  //padding-left: 10px;
  box-sizing: border-box;
}

.rotate {
  background-image: url("../PM_Back_Side.jpg") 0 0 repeat;
  background-size: 100%;
  background-repeat: no-repeat;
  //-webkit-transform: rotate(90deg);
  //-moz-transform: rotate(90deg);
  //-ms-transform: rotate(90deg);
  //-o-transform: rotate(90deg);
  //transform: rotate(90deg);
}
</style>