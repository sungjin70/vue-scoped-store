<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.nestedObj.nestedStrVal1 : </span>
    <br />
    <input v-model="myObject.nestedObj.nestedStrVal1" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component({
  watch: {
    'myObject.nestedObj.nestedStrVal1' : function (newVal : any, oldVal: any) {
      //this.$sendPageData(newVal,'pageObject.nestedObj.nestedStrVal1');
    },
  },
})
export default class extends Vue {

  private myObject: any = {nestedObj:{}};

  get title() {
      return 'child-with-api 3';
  }

  created() {
    console.log('created')
    this.$setPageDataCallback((data:any) => {
      // this.myObject = _.get(data, 'nestedObj.nestedStrVal1');
      // this.myObject = data;
      _.set(this.myObject,'nestedObj.nestedStrVal1',data);
      console.log('child-with-api3.vue : $setPageDataCallback', data, this.myObject);
    }, 'pageObject.nestedObj.nestedStrVal1');
  }

}
</script>
