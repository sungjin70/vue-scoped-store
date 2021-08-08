import Vue, { PluginFunction, VueConstructor } from 'vue';
import {VueDecorator} from 'vue-class-component';

export interface PageStoreOptions {
  direction?: 'both'|'read'|'write';
  path?:string;
  shareOnCreated?:boolean;
  deep?:boolean;
  immediate?: boolean;
}

export interface PageStoreMethodOptions {
  key:string;
}

export interface GlobalStoreOptions {
  direction?: 'both'|'read'|'write';
  path?:string;
  deep?:boolean;
  immediate?: boolean;
}

export interface GlobalStoreMethodOptions {
  key:string;
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    pageStore?: Record<string, any> | ((this: V) => Record<string, any>)
    globalStore?: Record<string, any> | ((this: V) => Record<string, any>)
  }
}

declare module "vue/types/vue" {
    interface Vue {
      $sendGlobalData(data:any, storePath:string, sendOpt?:any) : void;
      $setGlobalDataCallback(callback: (data: any, updater?:any) => void, storePath:string) : void;
      $sendPageData(data:any, path:string, sendOpt?:any) : void;
      $setPageDataCallback(callback: (data: any,updater?:any) => void, path:string) : void;
      $sendPageCommand(command:string, argument?:any) : void;
      $setPageCommandCallback(callback: (command:string, argument?:any) => void) : void;
      $sendGlobalCommand(key:string, command:string, argument?:any) : void;
      $setGlobalCommandCallback(key:string, callback: (command: string, argument?: any) => void) : void;
    }
  }
  

declare const VueScopedStore: PluginFunction<any>;
export default VueScopedStore;

/*
export function PageStore(options:PageStoreOptions = {}) {
  return createDecorator((componentOptions, key) => {
      
  componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
  const pageStore: any = componentOptions.pageStore;
  const propOptions = pageStore[key] || {};
  pageStore[key] = {...propOptions, ...options};
  // console.log('PageStore.createDecorator',componentOptions,key,pageStore);
})
}
*/

export type PageStoreFunction = (options?: PageStoreOptions) => VueDecorator;
export const PageStore : PageStoreFunction;

export type AsPageFunction = () => VueDecorator;
export const AsPage : AsPageFunction;

export type PageStoreBeforeSendFunction = (key: string) => VueDecorator;
export const PageStoreBeforeSend : PageStoreBeforeSendFunction;

export type PageStoreBeforeReceiveFunction = (key: string) => VueDecorator;
export const PageStoreBeforeReceive : PageStoreBeforeReceiveFunction;


export type GlobalStoreFunction = (options?: GlobalStoreOptions) => VueDecorator;
export const GlobalStore : GlobalStoreFunction;

export type GlobalStoreBeforeSendFunction = (key: string) => VueDecorator;
export const GlobalStoreBeforeSend : GlobalStoreBeforeSendFunction;

export type GlobalStoreBeforeReceiveFunction = (key: string) => VueDecorator;
export const GlobalStoreBeforeReceive : GlobalStoreBeforeReceiveFunction;


// export const VueScopedStoreSample: VueConstructor<Vue>;
