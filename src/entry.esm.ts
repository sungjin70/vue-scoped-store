import _Vue, { PluginFunction } from 'vue';

// Import vue components
import * as components from '@/lib-components/index';
import ScopedStoreMixin from './scoped-store/scoped-store-mixin';

import {sendGlobalData, setGlobalDataCallback, sendGlobalCommand, setGlobalCommandCallback} from './scoped-store/methods/global-data-callback';
import {sendPageData, setPageDataCallback, sendPageCommand, setPageCommandCallback} from './scoped-store/methods/page-data-callback';

// install function executed by Vue.use()
const install: PluginFunction<any> = function installVueScopedStore(Vue: typeof _Vue) {

  Vue.mixin(ScopedStoreMixin);

  /*
      $setGlobalDataCallback(key:string, callback: (data: any) => void, path?:string) : void;
      $sendPageData(data:any, path?:string) : void;
      $setPageDataCallback(callback: (data: any) => void) : void;
      $sendPageCommand(command:string, argument?:any) : void;
      $setPageCommandCallback(callback: (command:string, argument?:any) => void) : void;
      $sendGlobalCommand(key:string, command:string, argument?:any) : void;
      $setGlobalCommandCallback(key:string, callback: (command: string, argument?: any) => void) : void;
  */
  Vue.prototype.$setGlobalDataCallback = sendGlobalData;
  Vue.prototype.$setGlobalDataCallback = setGlobalDataCallback;
  Vue.prototype.$sendGlobalCommand = sendGlobalCommand;
  Vue.prototype.$setGlobalCommandCallback = setGlobalCommandCallback;

  Vue.prototype.$sendPageData = sendPageData;
  Vue.prototype.$setPageDataCallback = setPageDataCallback;
  Vue.prototype.$sendPageCommand = sendPageCommand;
  Vue.prototype.$setPageCommandCallback = setPageCommandCallback;

  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/lib-components/index';
