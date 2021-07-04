<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.strValue1 : </span>
    <br />
    <input v-model="pageObject.strValue1" />
    <br />
    <span>pageObject:{{pageObject}}</span>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component({
  pageStore:{
    pageObject:{
      //direction:'both', //read / write / both  - default:both
      //path:'', // a path of store. default:the same as key
      default:{strValue1:'default by pageStore'}, // default value
      deep:true, //an option of watch
      //immediate:true, //an option of watch
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject in child-with-options1', val, oldVal, options);
      },
      onReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onReceive for pageObject in child-with-options1', val, oldVal, options);
      },
    },
  },
  // watch: {
  //   'myObject.strValue1' : function (newVal : any, oldVal: any) {
  //     this.$sendPageData(newVal,'strValue1');
  //   },
  // },
})
export default class extends Vue {

  private pageObject: any = {};

  get title() {
      return 'child-with-options component 1';
  }

  created() {
    console.log('created')
    // this.$setPageDataCallback((data:any) => {
    //   console.log('child1.vue : $setPageDataCallback', data);
    //   // this.myObject = _.get(data, 'nestedObj.nestedStrVal1');
    //   this.pageObject = data;
    // });
  }


  updateByDeepCopy(path: string, value: any) {
    let clone = _.cloneDeep(this.pageObject);
    _.set(clone, path, value);
    this.pageObject = clone;
  }


}
</script>
