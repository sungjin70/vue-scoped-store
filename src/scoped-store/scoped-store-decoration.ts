import Vue, { ComponentOptions } from 'vue';
import { createDecorator } from 'vue-class-component';
import {PageStoreOptions, GlobalStoreOptions} from '../../vue-scoped-store';

export type VueClass<V> = (new(...args: any[]) => V & Vue) & typeof Vue;

function page<VC extends VueClass<Vue>>(Component: VC | ComponentOptions<Vue>): VC;
function page<VC extends VueClass<Vue>>(Component: VC | ComponentOptions<Vue>)  {

  const componentOptions = typeof Component === 'object' ? Component : (Component as any).options;
  componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
  const pageStore: any = componentOptions.pageStore;
  pageStore['isPage'] = true;

  console.log('@Page initilizing... ', componentOptions);

  return Component;
}

export {
	page as Page,
}


export function AsPage() {
  console.warn('@AsPage is the deprecated syntax. please use @Page instead');
  return createDecorator((componentOptions, key) => {
  componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
  const pageStore: any = componentOptions.pageStore;
  pageStore['isPage'] = true;
})
}


/**
 * decorator of a PageState property
 * 
 * @param  options
 */
 export function PageStore(options:PageStoreOptions = {}) {
    return createDecorator((componentOptions, key) => {
        
    componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
    const pageStore: any = componentOptions.pageStore;
    const propOptions = pageStore[key] || {};
    pageStore[key] = {...propOptions, ...options};
    // console.log('PageStore.createDecorator',componentOptions,key,pageStore);
  })
}

export function PageStoreBeforeSend(key:string) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
    const pageStore: any = componentOptions.pageStore;
    const propOptions = pageStore[key] || {};
    const originalMethod = componentOptions.methods[handler];
    pageStore[key] = {...propOptions, onBeforeSend:originalMethod};
    // console.log('PageStoreBeforeSend.createDecorator',componentOptions,key,pageStore,originalMethod);
  })
}

export function PageStoreBeforeReceive(key:string) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
    const pageStore: any = componentOptions.pageStore;
    const propOptions = pageStore[key] || {};
    const originalMethod = componentOptions.methods[handler];
    pageStore[key] = {...propOptions, onBeforeReceive:originalMethod};
    // console.log('PageStoreonBeforeReceive.createDecorator',componentOptions,key,pageStore);
  })
}

export function PageStoreReceived(key:string) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
    const pageStore: any = componentOptions.pageStore;
    const propOptions = pageStore[key] || {};
    const originalMethod = componentOptions.methods[handler];
    pageStore[key] = {...propOptions, onReceived:originalMethod};
    // console.log('PageStoreonBeforeReceive.createDecorator',componentOptions,key,pageStore);
  })
}




export function GlobalStore(options:GlobalStoreOptions = {}) {
  return createDecorator((componentOptions, key) => {      
    componentOptions.globalStore = componentOptions.globalStore || Object.create(null);
    const globalStore: any = componentOptions.globalStore;
    const propOptions = globalStore[key] || {};
    globalStore[key] = {...propOptions, ...options};
  })
}

export function GlobalStoreBeforeSend(key:string) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.globalStore = componentOptions.globalStore || Object.create(null);
    const globalStore: any = componentOptions.globalStore;
    const propOptions = globalStore[key] || {};
    const originalMethod = componentOptions.methods[handler];
    globalStore[key] = {...propOptions, onBeforeSend:originalMethod};
  })
}

export function GlobalStoreBeforeReceive(key:string) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.globalStore = componentOptions.globalStore || Object.create(null);
    const globalStore: any = componentOptions.globalStore;
    const propOptions = globalStore[key] || {};
    const originalMethod = componentOptions.methods[handler];
    globalStore[key] = {...propOptions, onBeforeReceive:originalMethod};
  })
}

export function GlobalStoreReceived(key:string) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.globalStore = componentOptions.globalStore || Object.create(null);
    const globalStore: any = componentOptions.globalStore;
    const propOptions = globalStore[key] || {};
    const originalMethod = componentOptions.methods[handler];
    globalStore[key] = {...propOptions, onReceived:originalMethod};
    // console.log('PageStoreonBeforeReceive.createDecorator',componentOptions,key,pageStore);
  })
}
