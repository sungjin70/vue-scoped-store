<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.strValue1 : </span>
    <br />
    <input v-model="myObject.strValue1" />
    <br />
    <span>myCounter : </span>
    <br />
    <input v-model="myCounter" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component({
  watch: {
    'myObject.strValue1' : {
      deep: true,
      handler (newVal : any, oldVal: any) {
        this.$sendPageData(newVal,'pageObject.strValue1');
      }
    },
    myCounter : function (newVal : any, oldVal: any) {
      this.$sendPageData(newVal,'pageCounter');
    },
  },
})
export default class extends Vue {

  private myObject: any = null;
  private myCounter:number = -5;

  get title() {
      return 'child-with-api1 1';
  }

  created() {
    console.log('created')
    this.$setPageDataCallback((data:any) => {
      console.log('child1.vue : $setPageDataCallback', data);
      // this.myObject = _.get(data, 'nestedObj.nestedStrVal1');
      this.myObject = data;
    }, 'pageObject');

    this.$setPageDataCallback((data:any) => {
      console.log('child1.vue : $setPageDataCallback', data);
      this.myCounter = data;
    }, 'pageCounter');
  }

}
</script>
