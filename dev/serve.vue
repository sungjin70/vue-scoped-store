<script lang="ts">
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
// import { VueScopedStoreSample } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  // components: {
  //  VueScopedStoreSample,
  // }
});
</script>

<template>
  <div id="app">
    <vue-scoped-store-sample />
  </div>
</template>
