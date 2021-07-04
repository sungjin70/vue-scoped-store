<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.strValue1 : </span>
    <br />
    <input v-model="myObject.strValue1" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component({
  watch: {
    'myObject.strValue1' : function (newVal : any, oldVal: any) {
      this.$sendPageData(newVal,'pageObject.strValue1');
    },
  },
})
export default class extends Vue {

  private myObject: any = null;

  get title() {
      return 'child component 1';
  }

  created() {
    console.log('created')
    this.$setPageDataCallback((data:any) => {
      console.log('child1.vue : $setPageDataCallback', data);
      // this.myObject = _.get(data, 'nestedObj.nestedStrVal1');
      this.myObject = data;
    }, 'pageObject');
  }


  updateByDeepCopy(path: string, value: any) {
    let clone = _.cloneDeep(this.myObject);
    _.set(clone, path, value);
    this.myObject = clone;
  }


}
</script>
