<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.nestedObj.nestedStrVal1 (as nestedStrVal1): </span>
    <br />
    <input v-model="nestedStrVal1" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
// import set from 'lodash.set';

@Component({
  watch: {
    nestedStrVal1 : function (newVal : string, oldVal: string) {
      if (newVal !== oldVal)
        this.$sendPageData(newVal,'pageObject.nestedObj.nestedStrVal1');
    },
  },
})
export default class extends Vue {

  private nestedStrVal1: string = 'nestedStr default';

  get title() {
      return 'child-with-api 3';
  }

  created() {
    // console.log('created')
    this.$setPageDataCallback((data:any) => {
      //set(this.myObject,'nestedObj.nestedStrVal1',data);
      this.nestedStrVal1 = data;
      // console.log('child-with-api3.vue : $setPageDataCallback', data, this.myObject);
    }, 'pageObject.nestedObj.nestedStrVal1');
  }

}
</script>
