<template>
  <div>
      <p><h2>{{title}}</h2></p>
      <p>
        <b>pageObject : {</b>
        <br />
        <b>&nbsp;&nbsp;strValue1 : </b><input v-model="pageObject.strValue1" style="width:300px" /> ,
        <br />
        <b>&nbsp;&nbsp;strValue2 : </b><input v-model="pageObject.strValue2" style="width:300px" /> ,
        <br />
        <b>&nbsp;&nbsp;numberValue1 : </b><input v-model="pageObject.numberValue1" type="number" /> ,
        <br />
        <b>&nbsp;&nbsp;nestedObj : {</b>
        <br />
        <b>&nbsp;&nbsp;&nbsp;&nbsp;nestedStrVal1 : </b><input v-model="pageObject.nestedObj.nestedStrVal1" style="width:300px" /> ,
        <br />
        <b>&nbsp;&nbsp;&nbsp;&nbsp;nestedStrVal1 : </b><input v-model="pageObject.nestedObj.nestedNumberVal1" type="number" /> ,
        <br />
        <b>&nbsp;&nbsp;}</b>
        <br />
        <b>}</b>
      </p>

      <button @click="updatePageObject()">updatePageObject()</button>

      <p>
        <b>carCounter : </b><input v-model="carCounter" type="number" /> 
      </p>
      <button @click="carCounter = 4321">update carCounter</button>
    <table width='100%' height='500'>
        <tr>
            <td style="background:yellow">
              <child5 />
            </td>
            <td style="background:green">
              <child6 />
            </td>
        </tr>
        <tr>
            <td style="background:gray">
              <child7 />
            </td>
            <td style="background:cyan">
              <child8 />
            </td>
        </tr>
    </table>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import child5 from './components/child-with-options5.vue';
import child6 from './components/child-with-options6.vue';
import child7 from './components/child-with-options7.vue';
import child8 from './components/child-with-options8.vue';
import {PageStore,AsPage,PageStoreBeforeSend,PageStoreonBeforeReceive} from '../scoped-store/scoped-store-decoration';

@Component({
  components:{
    child5,
    child6,
    child7,
    child8,
  },
  // pageStore:{
  //   isPage:true,
  // },

})
export default class extends Vue {
  @PageStore({deep:true})
  private pageObject: any = null;
  @PageStore()
  private carCounter:number = 100;

  @AsPage()
  private isPage = true;

  get title() {
      return this.$router.currentRoute.path;
  }

  created() {
    this.pageObject = {
      strValue1:'strValue1 defaule',
      strValue2:'strValue2 defaule',
      numberValue1:10,
      nestedObj :{
        nestedStrVal1:'nestedStrVal1 string',
        nestedNumberVal1:101,
      }
    };

    // console.log('created : $sendPageData', this.pageObject);
    // this.$sendPageData(this.pageObject);
    // this.$setPageDataCallback((data:any) => {
    //   console.log('page1.vue : $setPageDataCallback', data);
    //   this.pageObject = data;
    // });

    // this.carCounter = 12324;
  }

  @PageStoreBeforeSend('pageObject')
  onBeforeSendPageObject(val:any, oldVal:any, options:{proceed:boolean}) {
    console.log('onBeforeSendPageObject for pageObject in page4', val, oldVal, options);
  }

  @PageStoreonBeforeReceive('pageObject')
  onBeforeReceivePageObject(val:any, oldVal:any, options:{proceed:boolean}) {
    console.log('onBeforeReceivePageObject  for pageObject in page4', val, oldVal, options);
  }

  @PageStoreonBeforeReceive('carCounter')
  onBeforeReceiveCarCounter(val:any, oldVal:any, options:{proceed:boolean}) {
    console.log('onBeforeReceiveCarCounter  for carCounter in page4', val, oldVal, options);
  }

  updatePageObject() {
    this.pageObject = {
      strValue1:'strValue1 updated',
      strValue2:'strValue2 updated',
      numberValue1:20,
      nestedObj :{
        nestedStrVal1:'nestedStrVal1 string updated',
        nestedNumberVal1:201,
      }
    };
  }

  updateByDeepCopy(path: string, value: any) {
    let clone = _.cloneDeep(this.pageObject);
    _.set(clone, path, value);
    this.pageObject = clone;
  }


}
</script>
