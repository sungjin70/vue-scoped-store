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
      this.$sendPageData(newVal,'pageObject.nestedObj.nestedStrVal1');
    },
  },
})
export default class extends Vue {

  private myObject: any = null

  get title() {
      return 'child component 3';
  }

  created() {
    console.log('created')
    this.$setPageDataCallback((data:any) => {
      console.log('child3.vue : $setPageDataCallback', data);
      // this.myObject = _.get(data, 'nestedObj.nestedStrVal1');
      this.myObject = data;
    }, 'pageObject');
  }

}
</script>
