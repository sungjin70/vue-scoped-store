<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.nestedObj.nestedNumberVal1 : </span>
    <br />
    <input v-model="nestedStrVal1" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component({
  pageStore:{
    nestedStrVal1:{
      //direction:'both', //read / write / both  - default:both
      path:'pageObject.nestedObj.nestedNumberVal1', // a path of store. default:the same as key
      //default:-1, // default value
      //deep:true, //an option of watch
      //immediate:true, //an option of watch
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject.nestedObj.nestedNumberVal1 in child-with-options4', val, oldVal, options);
      },
      onReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onReceive for pageObject.nestedObj.nestedNumberVal1 in child-with-options4', val, oldVal, options);
      },
    },
  },
  // watch: {
  //   'myObject.nestedObj.nestedNumberVal1' : function (newVal : any, oldVal: any) {
  //     this.$sendPageData(newVal,'nestedObj.nestedNumberVal1');
  //   },
  // },
})
export default class extends Vue {

  private nestedStrVal1!: number = -100;

  get title() {
      return 'child-with-options component 4';
  }

  created() {
    console.log('created')
    // this.$setPageDataCallback((data:any) => {
    //   console.log('child4.vue : $setPageDataCallback', data);
    //   // this.myObject = _.get(data, 'nestedObj.nestedStrVal1');
    //   this.myObject = data;
    // });
  }


}
</script>
