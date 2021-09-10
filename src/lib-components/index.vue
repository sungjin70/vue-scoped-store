<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class extends Vue {

 created() {
   console.log('index.vue created()');
 }
}
</script>

<template>
  <div class="vue-scoped-store-sample">
    <p>The counter was to <b></b>.</p>
  </div>
</template>

<style scoped>
  .vue-scoped-store-sample {
    display: block;
    width: 400px;
    margin: 25px auto;
    border: 1px solid #ccc;
    background: #eaeaea;
    text-align: center;
    padding: 25px;
  }
  .vue-scoped-store-sample p {
    margin: 0 0 1em;
  }
</style>
