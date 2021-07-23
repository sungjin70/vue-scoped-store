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

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import _ from 'lodash';
import child1 from './components/child-with-options1.vue';
import child2 from './components/child-with-options2.vue';
import child3 from './components/child-with-options3.vue';
import child4 from './components/child-with-options4.vue';

import child5 from './components/child-with-api1.vue';
import child6 from './components/child-with-api3.vue';

@Component({
  components:{
    child1,
    child2,
    child3,
    child4,
    child5,
    child6,
  },
  pageStore:{
    isPage:true, //set this component as a page. so all state datas are maintained only while this component is alive.
    pageObject:{
      deep:true, //an option of watch
    },
    pageCounter:{},
  },
  globalStore:{
    globalObject:{
      deep:true, //an option of watch
    },
    globalCounter:{},
  }

})
export default class extends Vue {

  private pageObject: any = {
      strValue1:'strValue1 defaule',
      strValue2:'strValue2 defaule',
      numberValue1:10,
      nestedObj :{
        nestedStrVal1:'nestedStrVal1 string',
        nestedNumberVal1:101,
      }
    };
  private pageCounter:number = 100;

  private globalObject: any = {
      strValue1:'strValue1 defaule',
      strValue2:'strValue2 defaule',
      numberValue1:10,
      nestedObj :{
        nestedStrVal1:'nestedStrVal1 string',
        nestedNumberVal1:101,
      }
    };
  private globalCounter:number = 200;

  get title() {
      return this.$router.currentRoute.path;
  }

  created() {
    // this.globalCounter = 250;
    // this.globalObject.strValue2 = 'rrrr';
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
