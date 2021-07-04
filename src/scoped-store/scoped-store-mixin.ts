import Component from 'vue-class-component';
import Vue from 'vue';
import _ from 'lodash';

import {AnyTypeStoreService, StringTypeCommand} from "./core/any-type-store-service";
import {scopedStoreManager} from "./scoped-store-manager";
import { Subscription } from 'rxjs';

export interface ScopedStore {

}


@Component
export default class ScopedStoreComponent extends Vue {

    private dataTranManager = scopedStoreManager;
    private subscriptionsForPpge:Subscription[] = [];
    private subscriptionsForGlobal:Subscription[] = [];

    public isPage:boolean = false;

    created() {
        console.log('ScopedStoreComponent.created()');
        this.init();
    }

    beforeDestroy() {
        console.log('ScopedStoreComponent.beforeDestroy()');
        for (const k in this.subscriptionsForGlobal) {
            this.subscriptionsForGlobal[k].unsubscribe();
        }

        for (const k in this.subscriptionsForPpge) {
            this.subscriptionsForPpge[k].unsubscribe();
        }

        if (this.isPage) {
            console.log('if (this.isPage) in ScopedStoreComponent.beforeDestroy()');
            this.dataTranManager.pageDataService?.stop();
            this.dataTranManager.pageDataService = null;
        }
    }

    private readonly pathMapForPage = new Map<string,any>();
    private readonly pathMapForGlobal = new Map<string,any>();

    private init() {
        const vm = this;

        console.log('ScopedStoreComponent.init()');

        let ps = vm.$options.pageStore;
        if (typeof ps === 'function') {
            ps = ps.call(vm)
        }
        if (ps) {
          Object.keys(ps).forEach(key => {
            if (key === 'isPage' ) {
                if (typeof ps[key] === 'boolean') {
                    vm.isPage = ps[key];
                }
                else {
                    console.warn(`pageStore's isPage value has to be a boolean type value. {isPage:${ps[key]}} will be ignored`);
                }
            }

            if (!this.pathMapForPage.has(key)) {
                const opt = ps[key];
                const storeKey = opt.path || key;
                const onBeforeSendCallback = opt.direction !== 'read' && opt.onBeforeSend && typeof opt.onBeforeSend === 'function' ? opt.onBeforeSend : null;
                let recentlyRecevied = {}; // to prevent feedback
                const onBeforeSend = (val:any, oldVal:any) : any => {
                    if (recentlyRecevied !== val && onBeforeSendCallback) {
                        const callbackOpt = {proceed:true};
                        try {
                            onBeforeSendCallback(val, oldVal, callbackOpt);
                            if (callbackOpt.proceed)
                                vm.sendPageData(vm[key], storeKey);
                        }
                        catch(e) {
                            console.warn(e);
                        }
                    }
                }

                if (typeof opt.default !== 'undefined') {
                    vm[key] = opt.default;
                }

                vm.$watch(key, onBeforeSend, {deep:!!opt.deep,immediate:!!opt.immediate,});
                vm.setPageDataCallback((data:any) => {
                    recentlyRecevied = data;
                    vm[key] = data; 
                }, storeKey);
                this.pathMapForPage.set(key, opt);
            }
            else {
                console.warn(`duplicated store key is not allowed. [${key}]`);
            }
          })
        }

        let gs = vm.$options.globalStore;
        if (typeof gs === 'function') {
            gs = gs.call(vm)
        }
        if (gs) {
        //   vm.$observables = {}
        //   Object.keys(gs).forEach(key => {
        //     defineReactive(vm, key, undefined)
        //     const ob = vm.$observables[key] = obs[key]
        //     if (!isObservable(ob)) {
        //       warn(
        //         'Invalid Observable found in subscriptions option with key "' + key + '".',
        //         vm
        //       )
        //       return
        //     }
        //     vm._subscription.add(obs[key].subscribe(value => {
        //       vm[key] = value
        //     }, (error) => { throw error }))
        //   })
        }
    }

    public sendGlobalData(key:string, data:any, path:string) {
        const service : AnyTypeStoreService | undefined  = this.dataTranManager.findOfCreateGlobalService(key);
        if (service) {
            service.sendData(data, '', path);
        }
    }

    public setGlobalDataCallback(key:string, callback: (data: any) => void, path?:string) {
        const service : AnyTypeStoreService | undefined  = this.dataTranManager.findOfCreateGlobalService(key);
        if (service) {
            this.subscriptionsForGlobal.push(
                service.$state.subscribe(state => {
                    try {
                        callback(state);
                    } catch (e) {
                        console.warn('setGlobalDataCallback', e);
                    }
                })
            );
        }
    }

    public sendPageData(data:any, path:string) {
        if (!this.dataTranManager.pageDataService)
            this.dataTranManager.pageDataService = new AnyTypeStoreService();
        
        this.dataTranManager.pageDataService.sendData(data, '', path);
    }

    public setPageDataCallback(callback: (data: any) => void, path:string) {
        if (!this.dataTranManager.pageDataService)
            this.dataTranManager.pageDataService = new AnyTypeStoreService();

        this.subscriptionsForGlobal.push(
            this.dataTranManager.pageDataService.$state.subscribe(state => {
                try {
                    callback(_.get(state, path));
                } catch (e) {
                    console.warn('setPageDataCallback', e);
                }
            })
        );
    }

    public sendPageCommand(command:string, argument?:any) {
        if (!this.dataTranManager.pageDataService)
            this.dataTranManager.pageDataService = new AnyTypeStoreService();
        
        this.dataTranManager.pageDataService.sendCommand(command, argument);
    }

    public setPageCommandCallback(callback: (command:string, argument?:any) => void) {
        if (!this.dataTranManager.pageDataService)
            this.dataTranManager.pageDataService = new AnyTypeStoreService();

        this.subscriptionsForGlobal.push(
            this.dataTranManager.pageDataService.$command.subscribe(command => {
                try {
                    callback(command.command, command.argument);
                } catch (e) {
                    console.warn('setPageCommandCallback', e);
                }
            })
        );
    }

    public sendGlobalCommand(key:string, command:string, argument?:any) {
        const service = this.dataTranManager.findOfCreateGlobalService(key);
        if (service) {
            service.sendCommand(command, argument);
        }
    }

    public setGlobalCommandCallback(key:string, callback: (command: string, argument?: any) => void) {
        const service : AnyTypeStoreService | undefined  = this.dataTranManager.findOfCreateGlobalService(key);
        if (service) {
            this.subscriptionsForGlobal.push(
                service.$command.subscribe((command:StringTypeCommand) => {
                    try {
                        callback(command.command, command.argument);
                    } catch (e) {
                        console.warn('setGlobalCommandCallback', e);
                    }
                })
            );
        }
    }
}