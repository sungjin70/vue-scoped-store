<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.numberValue2 : </span>
    <br />
    <input v-model="myObject.numberValue1" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  watch: {
    'myObject.numberValue2' : function (newVal : any, oldVal: any) {
      this.$sendPageData(newVal,'pageObject.numberValue2');
    },
  },
})
export default class extends Vue {

  private myObject: any = null

  get title() {
      return 'child component 2';
  }

  created() {
    console.log('created')
    this.$setPageDataCallback((data:any) => {
      console.log('child2.vue : $setPageDataCallback', data);
      this.myObject = data;
    }, 'pageObject');
  }

}
</script>
