<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myNumber (path:pageObject.numberValue1) : </span>
    <br />
    <input v-model="myNumber" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  data:() => {
    return {
      myNumber:-100,
    }
  },
  pageStore:{
    myNumber:{
      //direction:'both', //read / write / both  - default:both
      path:'pageObject.numberValue1', // a path of store. default:the same as key
      // onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeSend for pageObject.numberValue1 in child-with-options2', val, oldVal, options);
      // },
      // onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
      //   console.log('onBeforeReceive for pageObject.numberValue1 in child-with-options2', val, oldVal, options);
      // },
    },
  },
})
export default class extends Vue {

  // private myNumber: number = -1;

  get title() {
      return 'child-with-options component 6';
  }
}
</script>
