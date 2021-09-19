import _Vue, { PluginFunction } from 'vue';

// Import vue components
// import * as components from '@/lib-components/index';
import ScopedStoreMixin from './scoped-store/scoped-store-mixin';
import {scopedStoreManager} from "./scoped-store/scoped-store-manager";

import {sendGlobalData, setGlobalDataCallback, sendGlobalCommand, setGlobalCommandCallback} from './scoped-store/methods/global-data-callback';
import {sendPageData, setPageDataCallback, sendPageCommand, setPageCommandCallback} from './scoped-store/methods/page-data-callback';


// install function executed by Vue.use()
const install: PluginFunction<any> = function installVueScopedStore(Vue: typeof _Vue, options?:any) {

  Vue.mixin(ScopedStoreMixin);

  Vue.prototype.$sendGlobalData = sendGlobalData;
  Vue.prototype.$setGlobalDataCallback = setGlobalDataCallback;
  Vue.prototype.$sendGlobalCommand = sendGlobalCommand;
  Vue.prototype.$setGlobalCommandCallback = setGlobalCommandCallback;

  Vue.prototype.$sendPageData = sendPageData;
  Vue.prototype.$setPageDataCallback = setPageDataCallback;
  Vue.prototype.$sendPageCommand = sendPageCommand;
  Vue.prototype.$setPageCommandCallback = setPageCommandCallback;

  console.log("installVueScopedStore() => options", options);
  if (options && options.debug) {
    scopedStoreManager.setDebug(!!options.debug);
  }

  // Object.entries(components).forEach(([componentName, component]) => {
  //   Vue.component(componentName, component);
  // });
};

// Create module definition for Vue.use()
export default install;

export {
  PageStore,
  AsPage,
  GlobalStore,
  GlobalStoreBeforeReceive,
  GlobalStoreReceived,
  GlobalStoreBeforeSend,
  PageStoreBeforeReceive,
  PageStoreReceived,
  PageStoreBeforeSend
} from './scoped-store/scoped-store-decoration';

// To allow individual component use, export components
// each can be registered via Vue.component()
// export * from '@/lib-components/index';
