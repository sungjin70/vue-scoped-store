<template>
  <div>
      <p><h2>{{title}}</h2></p>
    <span>myObject.nestedObj.nestedNumberVal1 : </span>
    <br />
    <input v-model="myObject_nestedObj_nestedNumberVal1" type="number" />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  watch: {
    'myObject.nestedObj.nestedNumberVal1' : function (newVal : any, oldVal: any) {
      this.$sendPageData(newVal,'pageObject.nestedObj.nestedNumberVal1');
    },
  },
})
export default class extends Vue {

  private myObject: any = null

  get title() {
      return 'child component 4';
  }

  get myObject_nestedObj_nestedNumberVal1() {
    try {
      return this.myObject.nestedObj.nestedNumberVal1;
    } catch (error) {
      return "";
    }
  }

  set myObject_nestedObj_nestedNumberVal1(value:string) {
    try {
      this.myObject.nestedObj.nestedNumberVal1 = value;
    } catch (error) {
    }
  }  

  created() {
    // console.log('created')
    this.$setPageDataCallback((data:any) => {
      console.log('child4.vue : $setPageDataCallback', data);
      this.myObject = data;
    },'pageObject');
  }
}
</script>
