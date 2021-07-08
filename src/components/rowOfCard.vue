<template>
  <draggable
    class="card-list"
    tag="div"
    v-model="mlist"
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
        v-for="(element, index) in cardMap"
        :key="element.order"
      >
        <img src="../PM_Back.jpg" />
        <i
          :class="
            element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
          "
          @click="element.fixed = !element.fixed"
          aria-hidden="true"
          >{{ index }} , {{ element.order }}
        </i>
      </div>
    </transition-group>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "rowofcard",
  display: "rowofcards",
  props: ["cardMap"],
  order: 7,
  components: {
    draggable,
  },
  data() {
    return {
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


明天解決index永遠=排列順序的問題