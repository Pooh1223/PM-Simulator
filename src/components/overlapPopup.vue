<template>
  <popper
    trigger="click"
    :options="{
      placement: 'bottom',
      modifiers: { offset: { offset: '0,-10px' } },
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

</style>