<template>
  <div class="container">
    <div class="row" v-for="(mlist,index) in list" :key="index">
      <rowofcard :card-map="mlist"></rowofcard>
    <!--<draggable
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
    </draggable>-->
    </div>
  </div>
</template>

<script>
//import draggable from "vuedraggable";
import rowofcard from "./rowOfCard.vue";
const message = ["1", "2", "3", "4", "5", "6", "7", "8"];
export default {
  name: "transition-example-2",
  display: "Transitions",
  order: 7,
  components: {
    //draggable,
    rowofcard,
  },
  data() {
    const rowofcard = 3;
    const mapped_list = message.map((name, index) => {
      return { name, order: index + 1 };
    });

    const mapped_sliced_list = [];

    for (let i = 0; i < mapped_list.length; i += rowofcard) {
      let ed =
        i + rowofcard < mapped_list.length ? i + rowofcard : mapped_list.length;
      mapped_sliced_list.push(mapped_list.slice(i, ed));
    }

    return {
      list: mapped_sliced_list,
      drag: false,
    };
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
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
