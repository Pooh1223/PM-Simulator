<template>
  <popper
    trigger="click"
    :options="{
      placement: 'left',
      modifiers: { offset: { offset: '200px,-10px' } },
      fallbackPlacements: ['bottom','right','left','top']
    }">
    <div class="popper">
      Popper Content
    </div>

    <button slot="reference">
      Reference Element
    </button>
  </popper>
</template>

<script>
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';

export default {
  components: {
    'popper': Popper
  },
}
</script>

<style>

.popper {
  width: 200px;
  height: 300px;
  opacity: 80%;
}

button{
  opacity: 30%;
  width: 100%;
}

button[slot="reference"]{
  font-size:0;
}

</style>