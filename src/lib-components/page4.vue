<template>
  <div>
    <h2>Using decorations like @PageStore, @GlobalStore and so on</h2>
    <table width='100%' >
      <tr>
        <td>
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
            <b>&nbsp;&nbsp;&nbsp;&nbsp;nestedNumberVal1 : </b><input v-model="pageObject.nestedObj.nestedNumberVal1" type="number" /> ,
            <br />
            <b>&nbsp;&nbsp;}</b>
            <br />
            <b>}</b>
          </p>

          <button @click="updatePageObject()">updatePageObject()</button>
        </td>
        <td>
          <p>
            <b>globalObject : {</b>
            <br />
            <b>&nbsp;&nbsp;strValue1 : </b><input v-model="globalObject.strValue1" style="width:300px" /> ,
            <br />
            <b>&nbsp;&nbsp;numberValue1 : </b><input v-model="globalObject.numberValue1" type="number" /> ,
            <br />
            <b>&nbsp;&nbsp;nestedObj : {</b>
            <br />
            <b>&nbsp;&nbsp;&nbsp;&nbsp;nestedStrVal1 : </b><input v-model="globalObject.nestedObj.nestedStrVal1" style="width:300px" /> ,
            <br />
            <b>&nbsp;&nbsp;&nbsp;&nbsp;nestedNumberVal1 : </b><input v-model="globalObject.nestedObj.nestedNumberVal1" type="number" /> ,
            <br />
            <b>&nbsp;&nbsp;}</b>
            <br />
            <b>}</b>
          </p>

        </td>
      </tr>
      <tr>
        <td>
          <p>
            <b>myPageCounter : </b><input v-model="myPageCounter" type="number" /> 
          </p>
          <button @click="myPageCounter = Number(myPageCounter) + 10">myPageCounter + 10</button>
        </td>
        <td>
          <p>
            <b>myGlobalCounter : </b><input v-model="myGlobalCounter" type="number" /> 
          </p>
          <button @click="myGlobalCounter = Number(myGlobalCounter) + 10">myGlobalCounter + 10</button>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <p>
            <b>globalArray : </b>{{globalArray}} 
          </p>
          <button @click="updateGlobalArray()">update globalArray</button>
        </td>
      </tr>
    </table>

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
import child5 from './components/child-with-options5.vue';
import child6 from './components/child-with-options6.vue';
import child7 from './components/child-with-options7.vue';
import child8 from './components/child-with-options8.vue';
import {
  PageStore,
  GlobalStore,
  Page,
  PageStoreBeforeSend,
  PageStoreBeforeReceive,
  PageStoreReceived
} from '../scoped-store/scoped-store-decoration';

@Page
@Component({
  components:{
    child5,
    child6,
    child7,
    child8,
  }
})
export default class extends Vue {
  @PageStore({deep:true})
  private pageObject: any = null;
  @PageStore({path:"pageCounter"})
  private myPageCounter:number = 100;

  // @AsPage()
  // private isPage = true;

  @GlobalStore()
  private globalArray: any[] = [];  
  
  @GlobalStore({deep:true})
  private globalObject: any = {
      strValue1:'strValue1 defaule',
      strValue2:'strValue2 defaule',
      numberValue1:10,
      nestedObj :{
        nestedStrVal1:'nestedStrVal1 string',
        nestedNumberVal1:101,
      }
    };
  @GlobalStore({path:"globalCounter"})
  private myGlobalCounter:number = 500;

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

    this.updateGlobalArray();
  }

  updateGlobalArray() {
    this.globalArray = [
      {aa:'aa1', bb:'bb1'},
      {aa:'aa2', bb:'bb2'},
      {aa:'aa3', bb:'bb3'},
      ];
  }

  @PageStoreBeforeSend('pageObject')
  onBeforeSendPageObject(val:any, oldVal:any, options:{proceed:boolean}) {
    console.log('onBeforeSendPageObject for pageObject in page4', val, oldVal, options);
  }

  @PageStoreBeforeReceive('pageObject')
  onBeforeReceivePageObject(val:any, oldVal:any, options:{proceed:boolean}) {
    console.log('onBeforeReceivePageObject  for pageObject in page4', val, oldVal, options);
  }

  @PageStoreReceived('pageObject')
  onReceivedPageObject(val:any) {
    console.log('onReceivedPageObject for pageObject in page4', val);
  }
  
  @PageStoreBeforeReceive('myCounter')
  onBeforeReceiveMyCounter(val:any, oldVal:any, options:{proceed:boolean}) {
    console.log('onBeforeReceiveMyCounter for myCounter in page4', val, oldVal, options);
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

}
</script>

<style>
td {
  text-align: left;
  width: 50%;
}
</style>