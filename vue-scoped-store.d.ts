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

// export type PageStoreFunction = (options?: PageStoreOptions) => VueDecorator;
// export const PageStore : PageStoreFunction;
declare function PageStore(options?: PageStoreOptions) : VueDecorator;

declare function AsPage(): VueDecorator;

// export type PageStoreBeforeSendFunction = (key: string) => VueDecorator;
declare function PageStoreBeforeSend(key: string) : VueDecorator;

// export type PageStoreBeforeReceiveFunction = (key: string) => VueDecorator;
declare function PageStoreBeforeReceive(key: string) : VueDecorator;

declare function GlobalStore(options?: GlobalStoreOptions) : VueDecorator;

declare function GlobalStoreBeforeSend(key: string) : VueDecorator;

declare function GlobalStoreBeforeReceive(key: string) : VueDecorator;

export {PageStore, AsPage, PageStoreBeforeSend, PageStoreBeforeReceive, GlobalStore, GlobalStoreBeforeSend, GlobalStoreBeforeReceive};


// export const VueScopedStoreSample: VueConstructor<Vue>;
