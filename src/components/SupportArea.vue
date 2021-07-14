<template>
  <div class="container">

    <dialog-drag
      title="test dialog" id="d1"
      v-if="showDialog"
      :options="{ width:250,top:250 }"
      @close="closeDialog">
      <p>This is test id: {{from_which_card}}</p>
    </dialog-drag>

    <b-modal 
      id="test-modal"
      title="Card-Detail"
      hide-backdrop
      :data="modalData">
      <p class="my-2">
        Test ,Test {{modalData}}
      </p>
    </b-modal>
    <draggable
      class="card-list"
      tag="div"
      v-model="list"
      v-bind="dragOptions"
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
          :key="'sa-' + index"
          v-b-modal.test-modal
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
import DialogDrag from 'vue-dialog-drag';
//import DropArea from 'vue-dialog-drag/dist/drop-area';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const message = ["1", "2", "3", "4", "5", "6", "7", "8"];
export default {
  name: "support-area",
  display: "support-area",
  order: 6,
  components: {
    draggable,
    DialogDrag,
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
      showDialog: false,
      from_which_card: null,
    };
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    },
    openModal(data) {
      console.log("jizz:" + data);
      this.modalData = data;
    },
    openDialog (data) {
      this.showDialog = true;
      this.from_which_card = data;
      console.log("it should open!");
    },
    closeDialog () {
      this.showDialog = false;
      console.log("it should close!");
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
#overlap {
  margin-bottom: 5px;
}
</style>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
<style src="vue-dialog-drag/dist/vue-drop-area.css"></style>

<!-- optional dialog styles, see example -->
<style src="vue-dialog-drag/dist/dialog-styles.css"></style>