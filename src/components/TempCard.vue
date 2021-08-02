<template>
  <div class="container">
    <strong> {{title_from}} </strong>
    <draggable
      class="card-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      @add="updateAddTo"
      @remove="updateRemoveTo"
    >
      <transition-group
        id="temp-area"
        :area-name="title_from"
        class="row"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        
        <div
          class="item col"
          v-for="(element, index) in card_list"
          :key="'ha-' + index"
          :class = "index % 10 == 0 ? 'item col-1' : 'item col-1' "
        >
          <img src="../PM_Back.jpg" />
          <i
            :class="
              element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
            "
            @click="element.fixed = !element.fixed"
            aria-hidden="true"
          >{{index}},{{element.order}}</i>
          <!--<b-button
            id="pick"
            variant="outline-primary"
            @click="addToHand(index)"
            v-if="click_from_addable">
            Pick
          </b-button>-->

        </div>
      </transition-group>
    </draggable>  
    
  </div>
</template>

<script>
import draggable from "vuedraggable";
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: "hand-area",
  display: "hand-area",
  order: 6,
  components: {
    draggable,
  },
  data() {
    //const message = [];

    //for(let i = 0;i < 50;++i){
    //  message.push(toString(i + 1));
    //}
    
    //const rowofcard = 5;
    //const mapped_list = message.map((name, index) => {
    //  return { name, order: index + 1 };
    //});

    const mapped_list = [];

    return {
      card_list: mapped_list,
      drag: false,
      title_from: "Temp Card Area",
      modalData: null,
      click_from_addable: false
    };
  },
  methods: {
    openModal(data) {
      console.log("jizz:" + data);
      this.modalData = data;
    },
    addToHand(id) {
      console.log("id: " + id);
      console.log("element: " + this.card_list[id].order);

      // remove it from list
      this.card_list.splice(id,1);
      
      this.$bus.$emit("get-card")
    },
    updateAddTo(card_data) {
      console.log("updataAddTo" + this.title_from);
      switch(this.title_from) {
        case "Deck":
          this.$bus.$emit("add-to-deck",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
        case "Discard":
          this.$bus.$emit("add-to-discard",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
        case "Ex-Deck":
          this.$bus.$emit("add-to-ex-deck",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
        case "Excluded":
          this.$bus.$emit("add-to-excluded",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
      }
    },
    updateRemoveTo(card_data) {
      switch(this.title_from) {
        case "Deck":
          this.$bus.$emit("remove-to-deck",card_data.oldIndex);
          break;
        case "Discard":
          this.$bus.$emit("remove-to-discard",card_data.oldIndex);
          break;
        case "Ex-Deck":
          this.$bus.$emit("remove-to-ex-deck",card_data.oldIndex);
          break;
        case "Excluded":
          this.$bus.$emit("remove-to-excluded",card_data.oldIndex);
          break;
      }
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
    this.$bus.$on("open-from-deck",(msg,card_list) => {
      this.title_from = msg;
      this.card_list = card_list;
      this.click_from_addable = false;
      console.log("temp: receive!");
    });

    this.$bus.$on("open-from-discard",(msg,card_list) => {
      console.log("jizz! " + msg);
      this.title_from = msg;
      this.card_list = card_list;
      this.click_from_addable = true;
      console.log("temp: receive!");
    });

    this.$bus.$on("open-from-ex-deck",(msg,card_list) => {
      this.title_from = msg;
      this.card_list = card_list;
      this.click_from_addable = true;
      console.log("temp: receive!");
    });

    this.$bus.$on("open-from-excluded",(msg,card_list) => {
      this.title_from = msg;
      this.card_list = card_list;
      this.click_from_addable = true;
      console.log("temp: receive!");
    });

    this.$bus.$on("cancel-temp-drop",(id) => {
      this.card_list.splice(id,1);
      console.log("temp: cancel " + id);
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
#pick {
  margin-bottom: 5px;
}
</style>
