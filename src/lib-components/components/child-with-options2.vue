<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myNumber (pageObject.numberValue2) : </span>
    <br />
    <input v-model="myNumber" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component({
  pageStore:{
    myNumber:{
      //direction:'both', //read / write / both  - default:both
      path:'pageObject.numberValue2', // a path of store. default:the same as key
      default:-1, // default value
      //deep:true, //an option of watch
      //immediate:true, //an option of watch
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject.numberValue2 in child-with-options2', val, oldVal, options);
      },
      onReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onReceive for pageObject.numberValue2 in child-with-options2', val, oldVal, options);
      },
    },
  },
  // watch: {
  //   'myObject.numberValue2' : function (newVal : any, oldVal: any) {
  //     this.$sendPageData(newVal,'numberValue2');
  //   },
  // },
})
export default class extends Vue {

  private myNumber!: number;

  get title() {
      return 'child-with-options component 2';
  }

  created() {
    console.log('created')
    // _.set(this.myObject,'numberValue2', 0);
    // this.$setPageDataCallback((data:any) => {
    //   console.log('child2.vue : $setPageDataCallback', data);
    //   // this.myObject = _.get(data, 'nestedObj.nestedStrVal1');
    //   this.myObject = data;
    // });
  }


}
</script>
