<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myCounter (path:pageCounter) : </span>
    <br />
    <input v-model="myCounter" type="number" />
    <br />
    <span>myObject.strValue1 : </span>
    <br />
    <input v-model="myObject.strValue1" />
    <br />
    <input v-model="myObject.strValue2" />
    <br />
    <span>pageObject:{{myObject}}</span>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component({
  pageStore:{
    myObject:{
      //direction:'read', //read / write / both  - default:both
      path:'pageObject', // a path of store. default:the same as key
      deep:true, //an option of watch
      //immediate:true, //an option of watch
      // onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeSend for pageObject in child-with-options1', val, oldVal, options);
      // },
      // onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeReceive for pageObject in child-with-options1', val, oldVal, options);
      // },
    },
    myCounter:{
      //direction:'both', //read / write / both  - default:both
      path:'pageCounter', // a path of store. default:the same as key
      // deep:true, //an option of watch
      //immediate:true, //an option of watch
      // onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeSend for pageCounter in child-with-options1', val, oldVal, options);
      // },
      // onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeReceive for pageCounter in child-with-options1', val, oldVal, options);
      // },
    },
  },
  // watch: {
  //   'myObject.strValue1' : function (newVal : any, oldVal: any) {
  //     this.$sendPageData(newVal,'strValue1');
  //   },
  // },
})
export default class extends Vue {

  private myObject: any = {strValue1:"8888",strValue2:"44444"};

  private myCounter:number = 5;

  get title() {
      return 'child-with-options component 1';
  }

}
</script>
