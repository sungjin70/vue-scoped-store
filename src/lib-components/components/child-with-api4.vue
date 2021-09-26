<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>nestedNumberVal1 (path:pageObject.nestedObj.nestedNumberVal1) : </span>
    <br />
    <input v-model="nestedNumberVal1" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  watch: {
    nestedNumberVal1 : function (newVal : any, oldVal: any) {
      this.$sendPageData(newVal,'pageObject.nestedObj.nestedNumberVal1');
    },
  },
})
export default class extends Vue {

  private nestedNumberVal1 = -1;

  get title() {
      return 'child-with-api 4';
  }

  // get myObject_nestedObj_nestedNumberVal1() {
  //   try {
  //     return this.myObject.nestedObj.nestedNumberVal1;
  //   } catch (error) {
  //     return "";
  //   }
  // }

  // set myObject_nestedObj_nestedNumberVal1(value:string) {
  //   try {
  //     this.myObject.nestedObj.nestedNumberVal1 = value;
  //   } catch (error) {
  //   }
  // }  

  created() {
    // console.log('created')
    this.$setPageDataCallback((data:any) => {
      console.log('child4.vue : $setPageDataCallback', data);
      this.nestedNumberVal1 = data;
    },'pageObject.nestedObj.nestedNumberVal1');
  }
}
</script>
