<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>numberValue1 (path:pageObject.numberValue1) : </span>
    <br />
    <input v-model="numberValue1" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  watch: {
    // 'myObject.numberValue2' : function (newVal : any, oldVal: any) {
    //   this.$sendPageData(newVal,'pageObject.numberValue2');
    // },
    numberValue1 : function (newVal : any, oldVal: any) {
      this.$sendPageData(newVal,'pageObject.numberValue1');
    },

  },
})
export default class extends Vue {

  // private myObject: any = null

  private numberValue1 = 0;

  get title() {
      return 'child-with-api1 2';
  }

  // get myObject_numberValue1() {
  //   try {
  //     return this.myObject.numberValue1;
  //   } catch (error) {
  //     return "";
  //   }
  // }

  // set myObject_numberValue1(value:string) {
  //   try {
  //     this.myObject.numberValue1 = value;
  //   } catch (error) {
  //   }
  // }  

  created() {
    // console.log('created')
    this.$setPageDataCallback((data:any) => {
      this.numberValue1 = data;
      // this.myObject = data;
    }, 'pageObject.numberValue1');
  }

}
</script>
