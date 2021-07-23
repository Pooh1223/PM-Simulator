<template>
  <div class="container">
    <strong> {{title_from}} </strong>
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
          class="item col"
          v-for="(element, index) in list"
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
          >{{index}}</i>
          <b-button
            id="pick"
            variant="outline-primary"
            @click="alert('jizz')"
            v-if="click_from_addable">
            Pick
          </b-button>

        </div>
      </transition-group>
    </draggable>  
    
  </div>
</template>

<script>
import draggable from "vuedraggable";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: "hand-area",
  display: "hand-area",
  order: 6,
  components: {
    draggable,
  },
  data() {
    const message = [];

    for(let i = 0;i < 50;++i){
      message.push(toString(i + 1));
    }

    const rowofcard = 5;
    const mapped_list = message.map((name, index) => {
      return { name, order: index + 1 };
    });

    return {
      row_of_card: rowofcard,
      list: mapped_list,
      drag: false,
      title_from: "jizzzzzzzzzzzzzzzzzzzzzz",
      modalData: null,
      click_from_addable: false
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
    this.$bus.$on("open-from-deck",(msg) => {
      this.title_from = msg;
      this.click_from_addable = false;
      console.log("temp: receive!");
    });

    this.$bus.$on("open-from-discard",(msg) => {
      this.title_from = msg;
      this.click_from_addable = true;
      console.log("temp: receive!");
    });

    this.$bus.$on("open-from-ex-deck",(msg) => {
      this.title_from = msg;
      this.click_from_addable = true;
      console.log("temp: receive!");
    });

    this.$bus.$on("open-from-excluded",(msg) => {
      this.title_from = msg;
      this.click_from_addable = true;
      console.log("temp: receive!");
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
</style>
