<template>
  <div class="container">
      <div class="deck-cards">
        <img src="../PM_Back.jpg" />
      </div>
      <b-button
        id="deck-draw"
        class="btn-block"
        variant="success"
        >
        Draw
      </b-button>
  </div>
</template>

<script>

export default {
  name: "deck",
  display: "Deck",
  order: 6,
  components: {
    //draggable,
  },
  data() {
    return {
      drag: false,
    };
  },
  methods: {
  },
  computed: {
    
  },
};
</script>

<style>

.deck-cards {
  cursor: click;
  float: left;
  //width: 50%;
  //height: 300px;
  background-image: url("../PM_Back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-position: center;
  padding-bottom: 5px;
}
.deck-cards img {
  vertical-align: top;
  max-width: 100%;
  opacity: 0;
}
#deck-draw {
  padding-bottom: 10px;
  text-align: center;
}
#deck-opt {
  text-align: center;
}

</style>
