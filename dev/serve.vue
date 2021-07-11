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
  <p>

    <router-link to="/">Home</router-link>
    &nbsp;
    <router-link to="/page1">page1</router-link>
    &nbsp;
    <router-link to="/page2">page2</router-link>
    &nbsp;
    <router-link to="/page3">page3</router-link>
    &nbsp;
    <router-link to="/page4">page4</router-link>
  </p>
  <h1>Current page: {{$router.currentRoute.path}}</h1>

  <router-view></router-view>
  </div>
</template>
