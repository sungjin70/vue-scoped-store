<template>
  <div>
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
            <b>myGlobalObject (path:globalObject) : {</b>
            <br />
            <b>&nbsp;&nbsp;strValue1 : </b><input v-model="myGlobalObject.strValue1" style="width:300px" /> ,
            <br />
            <b>&nbsp;&nbsp;numberValue1 : </b><input v-model="myGlobalObject.numberValue1" type="number" /> ,
            <br />
            <b>&nbsp;&nbsp;nestedObj : {</b>
            <br />
            <b>&nbsp;&nbsp;&nbsp;&nbsp;nestedStrVal1 : </b><input v-model="myGlobalObject.nestedObj.nestedStrVal1" style="width:300px" /> ,
            <br />
            <b>&nbsp;&nbsp;&nbsp;&nbsp;nestedNumberVal1 : </b><input v-model="myGlobalObject.nestedObj.nestedNumberVal1" type="number" /> ,
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
            <b>myPageCounter (path:pageCounter) : </b><input v-model="myPageCounter" type="number" /> 
          </p>
          <button @click="myPageCounter = Number(myPageCounter) + 10">myPageCounter + 10</button>
        </td>
        <td>
          <p>
            <b>myGlobalCounter (path:globalCounter) : </b><input v-model="myGlobalCounter" type="number" /> 
          </p>
          <button @click="myGlobalCounter = Number(myGlobalCounter) + 10">myGlobalCounter + 10</button>
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
import _ from 'lodash';
import child5 from './components/child-with-options5.vue';
import child6 from './components/child-with-options6.vue';
import child7 from './components/child-with-options7.vue';
import child8 from './components/child-with-options8.vue';

@Component({
  components:{
    child5,
    child6,
    child7,
    child8,
  },
  pageStore:{
    isPage:true,
    'pageObject':{
      //direction:'both', //read / write / both  - default:both
      //path:'', // a path of store. default:the same as key
      deep:true, //an option of watch
      //immediate:true, //an option of watch
      shareOnCreated:false, // share this data at the created stage - default:false
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject', val, oldVal, options);
      },
      onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeReceive for pageObject', val, oldVal, options);
      },
      onReceived: function(val:any) {
        console.log('onReceived for pageObject in page1', val);
      },
    },
    // 'pageObject.strValue1':{
    //   //direction:'both', //read / write / both  - default:both
    //   //path:'', // a path of store. default:the same as key
    //   //default:'default by pageStore', // default value
    //   //deep:false, //an option of watch
    //   //immediate:true, //an option of watch
    //   onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
    //     console.log('onBeforeSend for pageObject.strValue1', val, oldVal, options);
    //   },
    //   onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
    //     console.log('onBeforeReceive for pageObject.strValue1', val, oldVal, options);
    //   },
    // },
    // 'pageObject.numberValue1':{
    //   direction:'read', //read / write / both  - default:both
    //   //path:'', // a path of store. default:the same as key
    //   //default:20, // default value
    //   //deep:false, //an option of watch
    //   //immediate:true, //an option of watch
    //   onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
    //     console.log('onBeforeSend for pageObject.numberValue1', val, oldVal, options);
    //   },
    //   onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
    //     console.log('onBeforeReceive for pageObject.numberValue1', val, oldVal, options);
    //   },
    // },
    myPageCounter:{
      //direction:'both', //read / write / both  - default:both
      path:'pageCounter', // a path of store. default:the same as key
      // deep:true, //an option of watch
      //immediate:true, //an option of watch
      shareOnCreated:false,
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for carCounter in page1', val, oldVal, options);
      },
      onBeforeReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeReceive for carCounter in page1', val, oldVal, options);
      },
      onReceived: function(val:any) {
        console.log('onReceived for carCounter in page1', val);
      },
    },
  },
  globalStore:{
    myGlobalObject:{
      path:'globalObject', // a path of store. default:the same as key
      deep:true, //an option of watch
    },
    myGlobalCounter:{
      path:'globalCounter', // a path of store. default:the same as key
    },
  }
})
export default class extends Vue {

  private pageObject: any = null;
  private myPageCounter:number = 100;

  private myGlobalObject: any = {
      strValue1:'strValue1 defaule',
      strValue2:'strValue2 defaule',
      numberValue1:10,
      nestedObj :{
        nestedStrVal1:'nestedStrVal1 string',
        nestedNumberVal1:101,
      }
    };
  private myGlobalCounter:number = 200;

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
