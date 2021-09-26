<template>
  <div>
    <h3>Using typed-store (basic)</h3>
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
          <button @click="resetPageObject()">reset PageObject</button>
          <br />
          pageBoolean : <input v-model="pageBoolean" type="checkbox" /> : {{pageBoolean}}
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
            <b>pageCounter : </b><input v-model="pageCounter" type="number" /> 
          </p>
          <button @click="pageCounter = Number(pageCounter) + 10">pageCounter + 10</button>
        </td>
        <td>
          <p>
            <b>globalCounter : </b><input v-model="globalCounter" type="number" /> 
          </p>
          <button @click="globalCounter = Number(globalCounter) + 10">globalCounter + 10</button>
        </td>
      </tr>
    </table>

    <table width='100%' >
        <tr>
            <td style="background:yellow">
              <child1 />
            </td>
            <td style="background:green">
              <child2 />
            </td>
        </tr>
        <tr>
            <td style="background:gray">
              <child3 />
            </td>
            <td style="background:cyan">
              <child4 />
            </td>
        </tr>
        <tr>
            <td style="background:CornflowerBlue">
              <child5 />
            </td>
            <td style="background:DarkGoldenRod">
              <child6 />
            </td>
        </tr>
    </table>
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import child1 from './components/child-with-options1.vue';
import child2 from './components/child-with-options2.vue';
import child3 from './components/child-with-options3.vue';
import child4 from './components/child-with-options4.vue';
import child5 from './components/child-with-api1.vue';
import child6 from './components/child-with-api3.vue';

export default Vue.extend(
{
  components:{
    child1,
    child2,
    child3,
    child4,
    child5,
    child6,
  },
  data:function() {
    return {
      pageObject: {
        strValue1:'strValue1 default',
        strValue2:'strValue2 default',
        numberValue1:10,
        nestedObj :{
          nestedStrVal1:'nestedStrVal1 string',
          nestedNumberVal1:101,
        }
      },
      pageCounter: 100,
      pageBoolean: true,
      globalObject: {
        strValue1:'strValue1 default',
        strValue2:'strValue2 default',
        numberValue1:10,
        nestedObj :{
          nestedStrVal1:'nestedStrVal1 string',
          nestedNumberVal1:101,
        }
      },
      globalCounter:200
    }
  },
  pageStore:{
    isPage:true, //set this component as a page. so all states are maintained only while this component is alive.
    pageObject:{
      deep:true, //an option of watch
    },
    pageCounter:{},
    pageBoolean:{
      onBeforeSend: function(val, oldVal, options) {
        console.log('onBeforeSend for pageBoolean in page1', val, oldVal, options);
      },
      onBeforeReceive: function(val, oldVal, options) {
        console.log('onBeforeReceive for pageBoolean in page1', val, oldVal, options);
      }
    },
  },
  globalStore:{
    globalObject:{
      deep:true, //an option of watch
    },
    globalCounter:{},
  },
  methods:{
    resetPageObject() {
      this.pageObject = {
        strValue1:'strValue1 default',
        strValue2:'strValue2 default',
        numberValue1:10,
        nestedObj :{
          nestedStrVal1:'nestedStrVal1 string',
          nestedNumberVal1:101,
        }
      };
    },
    resetGlobalObject() {
      this.globalObject = {
        strValue1:'strValue1 default',
        strValue2:'strValue2 default',
        numberValue1:10,
        nestedObj :{
          nestedStrVal1:'nestedStrVal1 string',
          nestedNumberVal1:101,
        }
      };
    },
    created() {
      consol.log('page1.vue created()');
    }
  }
}
);
</script>

<style>
td {
  text-align: left;
  width: 50%;
}
</style>