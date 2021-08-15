<template>
  <div>
    <b-button
      v-b-modal.modal-no-backdrop
      @click="showModal(i)">
      Open modal
    </b-button>

    <b-modal :ref="'modal' + i"
      id="modal-no-backdrop"
      hide-backdrop
      content-class="shadow"
      title="BootstrapVue">
      
      <p class="my-2">
        Test ,Test {{i}}
      </p>
    </b-modal>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: "card-modal",
  display: "card-modal",
  props:["i"],
  methods: {
      showModal(i) {
          console.log("jizzzzzzzzzzzzz!!!\n" + this.$refs);
          console.log(this.$refs['modal' + i][0]);
          this.$refs['modal' + i][0].show();
      },
      hideModal(i) {
          this.$refs['modal' + i][0].hide();
      }
  }
}
</script>

<style>
</style>