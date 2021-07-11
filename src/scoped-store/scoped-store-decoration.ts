import { createDecorator } from 'vue-class-component';
import {PageStoreOptions} from '../../options';

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

export function AsPage() {
  return createDecorator((componentOptions, key) => {
      
  componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
  const pageStore: any = componentOptions.pageStore;

  pageStore['isPage'] = true;
  // console.log('AsPage.createDecorator',key,pageStore);
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

export function PageStoreonBeforeReceive(key:string) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.pageStore = componentOptions.pageStore || Object.create(null);
    const pageStore: any = componentOptions.pageStore;
    const propOptions = pageStore[key] || {};
    const originalMethod = componentOptions.methods[handler];
    pageStore[key] = {...propOptions, onBeforeReceive:originalMethod};
    // console.log('PageStoreonBeforeReceive.createDecorator',componentOptions,key,pageStore);
  })
}