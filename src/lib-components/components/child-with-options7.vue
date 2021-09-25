<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>nestedStrVal1 (path:pageObject.nestedObj.nestedStrVal1) : </span>
    <br />
    <input v-model="nestedStrVal1" />
    <br />
    <br />
    <p>
      <b>globalArray : </b>{{globalArray}} 
    </p>
    <button @click="updateGlobalArray()">update globalArray</button>
    <button @click="addToGlobalArray()">Add Item to globalArray</button>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { GlobalStore } from '../../scoped-store/scoped-store-decoration';

@Component({
  pageStore:{
    nestedStrVal1:{
      //direction:'both', //read / write / both  - default:both
      path:'pageObject.nestedObj.nestedStrVal1', // a path of store. default:the same as key
      //deep:true, //an option of watch
      //immediate:true, //an option of watch
      // onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeSend for pageObject.nestedObj.nestedStrVal1 in child-with-options3', val, oldVal, options);
      // },
      // onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeReceive for pageObject.nestedObj.nestedStrVal1 in child-with-options3', val, oldVal, options);
      // },
    },
  },
})
export default class extends Vue {

  private nestedStrVal1:string = "nestedStrVal1 default";

  @GlobalStore()
  private globalArray: any[] = [];  

  get title() {
      return 'child-with-options component 7';
  }

  updateGlobalArray() {
    this.globalArray = [
      {aa:'aa100', bb:'bb100'},
      {aa:'aa200', bb:'bb200'},
      {aa:'aa300', bb:'bb300'},
      ];
  }

  addToGlobalArray() {
    this.globalArray.push({aa:'aa400', bb:'bb400'});
  }

}
</script>
