<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>strValue1 (path:pageObject.strValue1) : </span>
    <br />
    <input v-model="strValue1" />
    <br />
    <span>myCounter (path: pageCounter): </span>
    <br />
    <input v-model="myCounter" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  watch: {
    strValue1 : {
      handler (newVal : any, oldVal: any) {
        if (newVal != oldVal) 
        {
          console.log('pageObject.strValue1.handler() => sending data');
          this.$sendPageData(newVal,'pageObject.strValue1');
        }
      }
    },
    myCounter : function (newVal : any, oldVal: any) {
      if (newVal != oldVal) 
      {
        console.log('myCounter => sending data');
        this.$sendPageData(newVal,'pageCounter');
      }
    },
  },
})
export default class extends Vue {

  private strValue1: string = '';
  private myCounter:number = -5;

  get title() {
      return 'child-with-api1 1';
  }

  created() {
    // console.log('created')
    this.$setPageDataCallback((data:any) => {
      // console.log('child1.vue : $setPageDataCallback', data);
      this.strValue1 = data;
    }, 'pageObject.strValue1');

    this.$setPageDataCallback((data:any) => {
      // console.log('child1.vue : $setPageDataCallback', data);
      this.myCounter = data;
    }, 'pageCounter');
  }

}
</script>
