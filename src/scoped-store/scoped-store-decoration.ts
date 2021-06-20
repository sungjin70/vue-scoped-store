import { createDecorator } from 'vue-class-component';
import { ComponentOptions } from 'vue';
import {scopedStoreManager} from './scoped-store-manager';
import _ from 'lodash';
var hash = require('object-hash');

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  options
 */
 export function StoreModel(path: string, options = {}) {
    return createDecorator((componentOptions, handler) => {
        console.log('StoreModel.createDecorator',componentOptions,handler);
      componentOptions.watch ||= Object.create(null)
      const watch: any = componentOptions.watch
      if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
        watch[path] = [watch[path]]
      } else if (typeof watch[path] === 'undefined') {
        watch[path] = []
      }


      if (typeof componentOptions.beforeDestroy === 'function') {
        const orgBeforeDestroy = componentOptions.beforeDestroy;
        componentOptions.beforeDestroy = function() {
            console.log('beforeDestroy created by StoreModel');
            (this as any).$myInjectedFunction('works in beforeDestroy');
            orgBeforeDestroy();
        }
      }
      else
      {
        componentOptions.beforeDestroy = function() {
            console.log('beforeDestroy created by StoreModel');
            (this as any).$myInjectedFunction('works in beforeDestroy');
        }
      }

      const hashed = hash(componentOptions, { excludeValues: true });
      
      function preparePathVars(self:any) {
        const pathMetas = scopedStoreManager.getPathMetaInComponent(hashed);

        const len = (pathMetas as []).length;
        for (let i=0;i<len;i++) {
            const opt:any = (pathMetas as [])[i];
            if (_.get(self,opt.path) === 'undefined') {
                let val = _.get(self,opt.path,'default') || {};
                _.set(self,opt.path,val);
            }
        }

      }

      if (typeof componentOptions.created === 'function') {
        if (scopedStoreManager.getPathMetaInComponentCount(hashed) == 0) {
            const orgCreated = componentOptions.created;
            componentOptions.created = function() {
                console.log('created by StoreModel');
                orgCreated();
                preparePathVars(this);
            }    
        }
      }
      else
      {
        componentOptions.created = function() {
            preparePathVars(this);
        }
      }

      scopedStoreManager.addPathMetaInComponent(hashed,{path, options});
  
      console.log('StoreModel.createDecorator, watch[path].push', handler, options );
      watch[path].push({ handler, ...options })
    })
  }