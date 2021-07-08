<template>
  <div class="container">
    <!--<div class="row" v-for="mlist in list" :key="mlist.order">
      <rowofcard :card-map="mlist"></rowofcard>-->
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
          :key="element.order"
          @click="show_list"
          :class = "index % 5 == 0 ? 'item col-2 offset-1' : 'item col-2' "
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
    
  </div>
</template>

<script>
import draggable from "vuedraggable";
//import rowofcard from "./rowOfCard.vue";
const message = ["1", "2", "3", "4", "5", "6", "7", "8"];
export default {
  name: "transition-example-2",
  display: "Transitions",
  order: 6,
  components: {
    draggable,
    //rowofcard,
  },
  data() {
    const rowofcard = 5;
    const mapped_list = message.map((name, index) => {
      return { name, order: index + 1 };
    });

    const mapped_sliced_list = [];

    for (let i = 0; i < mapped_list.length; i += rowofcard) {
      let ed =
        i + rowofcard < mapped_list.length ? i + rowofcard : mapped_list.length;
      mapped_sliced_list.push({sublist: mapped_list.slice(i, ed), order: i + 1});
    }

    return {
      row_of_card: rowofcard,
      list: mapped_list,
      sublist:mapped_sliced_list,
      drag: false,
    };
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);

      this.sublist = []
      for (let i = 0; i < this.sublist.length; i += this.rowofcard) {
        let ed =
          i + this.rowofcard < this.list.length ? i + this.rowofcard : this.list.length;
        this.sublist.push({sublist: this.list.slice(i, ed), order: i + 1});
      }
    },
    show_list() {
      console.log(this.list);
      console.log(this.sublist);
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
</style>
