<template>
  <div>
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
import child1 from './components/child1.vue';
import child2 from './components/child2.vue';
import child3 from './components/child3.vue';
import child4 from './components/child4.vue';

@Component({
  components:{
    child1,
    child2,
    child3,
    child4,
  },
  pageStore:{
    isPage:true,
  }
})
export default class extends Vue {

  private pageObject: any = {
    strValue1:'string defaule',
    numberValue1:10,
    nestedObj :{
      nestedStrVal1:'nested string',
      nestedNumberVal1:101,
    }
  }

  get title() {
      return this.$router.currentRoute.path;
  }

  created() {
    console.log('created : $sendPageData', this.pageObject);
    this.$sendPageData(this.pageObject, 'pageObject');
    this.$setPageDataCallback((data:any) => {
      console.log('page2.vue : $setPageDataCallback', data);
      this.pageObject = data;
    }, 'pageObject');
  }


  updateByDeepCopy(path: string, value: any) {
    let clone = _.cloneDeep(this.pageObject);
    _.set(clone, path, value);
    this.pageObject = clone;
  }


}
</script>
