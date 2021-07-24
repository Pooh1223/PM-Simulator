<template>
  <div class="container">

    <!--<div
      class="test-dialog"
      v-if="showDialog"
      style="background-color: white; position: relative">
      <p>This is test id: {{from_which_card}}</p>

      <draggable
        class="overlap-card-list"
        tag="div"
        v-model="list"
        v-bind="dragOptions"
        @start.stop="drag = true"
        @end.stop="dismissPinned"
      >
        <transition-group
          class="row"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          
          <div
            :class = "index % 5 == 0 ? 'item col-2 offset-1' : 'item col-2' "
            v-for="(element, index) in list"
            :key="element.order"
            v-b-modal.card-detail
            @click="openModal(element.order)"
            @mousedown="firePinned"
          >
            <img src="../PM_Back.jpg" />
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            >{{index}} , {{element.order}}</i>
          </div>
        </transition-group>
      </draggable>
    </div>-->

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
      v-model="list"
      v-bind="dragOptions"
      :emptyInsertThreshold="150"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group
        class="row"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        
        <div
          :class = "index % 5 == 0 ? 'item col-2 offset-1' : 'item col-2' "
          v-for="(element, index) in list"
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
            v-model="list"
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
                v-for="element in list"
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
      list: mapped_list,
      drag: false,
      modalData: null,
      showDialog: showd,
      from_which_card: null,
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
      console.log(this.list);
      console.log(this.showDialog);
    },
    closeDialog () {
      this.showDialog = false;
      console.log("it should close!");
    },
    moveCard () {
      this.drag = true;
      console.log('click card on!');
    },
    occur () {
      console.log('fire');
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