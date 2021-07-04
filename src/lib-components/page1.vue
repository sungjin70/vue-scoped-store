<template>
  <div>
      <p><h2>{{title}}</h2></p>
      <p>
        {{pageObject}}
      </p>
      
    <table width='100%' height='500'>
        <tr>
            <td style="background:yellow"><child1 /></td>
            <td style="background:green"><child2 /></td>
        </tr>
        <tr>
            <td style="background:gray"><child3 /></td>
            <td style="background:cyan"><child4 /></td>
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

@Component({
  components:{
    child1,
    child2,
    child3,
    child4,
  },
  pageStore:{
    isPage:true,
    'pageObject':{
      //direction:'both', //read / write / both  - default:both
      //path:'', // a path of store. default:the same as key
      default:{}, // default value
      deep:true, //an option of watch
      //immediate:true, //an option of watch
      shareOnCreated:true, // share this data at the created stage - default:false
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject', val, oldVal, options);
      },
      onReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onReceive for pageObject', val, oldVal, options);
      },
    },
    'pageObject.strValue1':{
      //direction:'both', //read / write / both  - default:both
      //path:'', // a path of store. default:the same as key
      //default:'default by pageStore', // default value
      //deep:false, //an option of watch
      //immediate:true, //an option of watch
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject.strValue1', val, oldVal, options);
      },
      onReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onReceive for pageObject.strValue1', val, oldVal, options);
      },
    },
    'pageObject.numberValue1':{
      direction:'read', //read / write / both  - default:both
      //path:'', // a path of store. default:the same as key
      //default:20, // default value
      //deep:false, //an option of watch
      //immediate:true, //an option of watch
      onBeforeSend: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onBeforeSend for pageObject.numberValue1', val, oldVal, options);
      },
      onReceive: function(val:any, oldVal:any, options:{proceed:boolean}) {
        console.log('onReceive for pageObject.numberValue1', val, oldVal, options);
      },
    },
  },

})
export default class extends Vue {

  private pageObject: any = null

  get title() {
      return this.$router.currentRoute.path;
  }

  created() {
    this.pageObject = {
      strValue1:'string defaule',
      numberValue1:10,
      nestedObj :{
        nestedStrVal1:'nested string',
        nestedNumberVal1:101,
      }
    };

    console.log('created : $sendPageData', this.pageObject);
    // this.$sendPageData(this.pageObject);
    // this.$setPageDataCallback((data:any) => {
    //   console.log('page1.vue : $setPageDataCallback', data);
    //   this.pageObject = data;
    // });
  }



  updateByDeepCopy(path: string, value: any) {
    let clone = _.cloneDeep(this.pageObject);
    _.set(clone, path, value);
    this.pageObject = clone;
  }


}
</script>
