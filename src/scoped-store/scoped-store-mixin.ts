import Component from 'vue-class-component';
import Vue from 'vue';
import _ from 'lodash';

import {AnyTypeStoreService, StringTypeCommand} from "./core/any-type-store-service";
import {scopedStoreManager} from "./scoped-store-manager";
import { Subscription } from 'rxjs';

export interface ScopedStore {
}

interface SetupStorePropertyArg {
    vm:any;
    key:any;
    keyStore:any;
    recentlySent:any;
    storeKey:string;
    isForPage:boolean
}

@Component
export default class ScopedStoreComponent extends Vue {

    private readonly dataTranManager = scopedStoreManager;
    private readonly subscriptionsForPage:Subscription[] = [];
    private readonly subscriptionsForGlobal:Subscription[] = [];

    private readonly pathMapForPage = new Map<string,any>();
    private readonly pathMapForGlobal = new Map<string,any>();

    public isPage:boolean = false;
    private pageDataService!:any;

    created() {
        // console.log('ScopedStoreComponent.created()');
        this.init();
    }

    beforeDestroy() {
        // console.log('ScopedStoreComponent.beforeDestroy()');
        for (const k in this.subscriptionsForGlobal) {
            this.subscriptionsForGlobal[k].unsubscribe();
        }

        for (const k in this.subscriptionsForPage) {
            this.subscriptionsForPage[k].unsubscribe();
        }

        if (this.isPage) {
            console.log('if (this.isPage) in ScopedStoreComponent.beforeDestroy()');
            this.pageDataService?.stop();
            // this.dataTranManager.pageDataService = undefined;
        }
    }

    private init() {
        const vm = this as any;

        // console.log('ScopedStoreComponent.init()');

        let ps = vm.$options.pageStore;
        if (typeof ps === 'function') {
            ps = ps.call(vm)
        }
        if (ps) {
            if (typeof ps['isPage'] === 'boolean') {
                vm.isPage = ps['isPage'];
                this.dataTranManager.pageDataService = new AnyTypeStoreService();
                // console.log("dataTranManager.pageDataService created");
                vm.pageDataService = this.dataTranManager.pageDataService;
            }

          Object.keys(ps).forEach(key => {
            if (key === 'isPage' ) 
                return;

            if (!this.pathMapForPage.has(key)) {
                const opt = ps[key];
                const storeKey = (opt.path || key) as string;
                const args:SetupStorePropertyArg = {vm,key,keyStore:ps,recentlySent:{},storeKey,isForPage:true};
                this.setupStoreProperty(args);

/*                 
                // console.log('registering scopped store for key=', key, storeKey);
                const onBeforeSendCallback = opt.direction !== 'read' && opt.onBeforeSend && typeof opt.onBeforeSend === 'function' ? opt.onBeforeSend : null;
                let recentlyRecevied = {}; // to prevent feedback
                let recentlySent = {}; // to prevent feedback
                const onBeforeSend = (val:any, oldVal:any) : any => {
                    // console.log('const onBeforeSend = (val:any, oldVal:any)', 
                    //     val, oldVal,recentlyRecevied,recentlyRecevied !== val);
                    if (!_.isEqual(recentlyRecevied, val)) {
                        let sendData = opt.direction !== 'read';
                        if (onBeforeSendCallback) {
                            const callbackOpt = {proceed:true, key:key, path:storeKey};
                            try {
                                onBeforeSendCallback(val, oldVal, callbackOpt);
                                sendData = callbackOpt.proceed;
                            }
                            catch(e) {
                                console.warn(e);
                            }
                        }

                        if (sendData) {
                            recentlySent = vm.sendPageData(val, storeKey,{key, path:storeKey});
                        }
                    }
                }

                vm.$watch(key, onBeforeSend, {deep:!!opt.deep,immediate:!!opt.immediate,});
                const onBeforeReceive = opt.direction !== 'write' && opt.onBeforeReceive && typeof opt.onBeforeReceive === 'function' ? opt.onBeforeReceive : null;
                vm.setPageDataCallback((data:any,updater?:any) => {
                    const updaterPath = updater && updater.path ? (updater.path as string) : "";
                    //컴포넌트 초기화 때 
                    //이 시점에 프로퍼티에 undefind가 설정되면 
                    //프로퍼티가 반응성 기능을 하지 못한다.
                    if (data === undefined)
                        return;
                    
                    const nested = updaterPath.length > storeKey.length && updaterPath.startsWith(storeKey);
                    if ((recentlySent != data && vm[key] != data) || nested) {
                        // console.log('vm.setPageDataCallback => if (recentlySent != data && vm[key] != data)'
                        //     , key, recentlySent, data, updaterPath, nested, vm[key]);
                        let acceptData = opt.direction !== 'write';
                        if (onBeforeReceive) {
                            const callbackOpt = {proceed:true, key:key, path:storeKey, updaterPath};
                            try {
                                onBeforeReceive(data, vm[key], callbackOpt);
                                acceptData = callbackOpt.proceed;
                            }
                            catch(e) {
                                console.warn(e);
                            }
                        }

                        if (acceptData) {
                            if (typeof(data) == "object"){
                                //vm[key] = recentlyRecevied = {...data};
                                Object.getOwnPropertyNames(data).forEach(
                                    (val) => {
                                        Vue.set(vm[key], val, data[val]);
                                    }
                                );
                                // recentlyRecevied = data;
                            }
                            else if (Array.isArray(data)) {
                                const targetArray = vm[key] as Array<any>;
                                targetArray.length = 0;
                                (data as Array<any>).forEach((item) => {
                                    targetArray.push(item);
                                });
                                // recentlyRecevied = data;
                                //vm[key] = recentlyRecevied = [...data];
                            }
                            else
                                // vm[key] = recentlyRecevied = data;
                                vm[key] = data;

                            recentlyRecevied = _.cloneDeep(vm[key]);
                            // vm.$data[key] = recentlyRecevied = data;
                            // console.log('data updated with received one', vm[key]);
                        }
                    }
                }, storeKey);             
 */

                if (opt.shareOnCreated) {
                    if (vm[key] !== undefined) {
                        args.recentlySent = vm.sendPageData(vm[key], storeKey,{key, path:storeKey});
                    }
                    else {
                        console.warn(`undefined cannot share so shareOnCreated will be ignored. [${key}]`);        
                    }
                }
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

          Object.keys(gs).forEach(key => {
            if (!this.pathMapForGlobal.has(key)) {
                const opt = ps[key];
                const storeKey = (opt.path || key) as string;
                const args:SetupStorePropertyArg = {vm,key,keyStore:gs,recentlySent:{},storeKey,isForPage:false};
                this.setupStoreProperty(args);

                this.pathMapForGlobal.set(key, opt);
            }
            
          })
        }
    }


    private setupStoreProperty(args:SetupStorePropertyArg) {
        /*vm:any, key:any, keyStore:any, recentlySent:any, storeKey:string, isForPage:boolean */
        const opt = args.keyStore[args.key];
        // const storeKey = (opt.path || key) as string;
        // console.log('registering scopped store for key=', key, storeKey);
        const onBeforeSendCallback = opt.direction !== 'read' && opt.onBeforeSend && typeof opt.onBeforeSend === 'function' ? opt.onBeforeSend : null;
        let recentlyRecevied = {}; // to prevent feedback
        // let recentlySent = {}; // to prevent feedback
        const onBeforeSend = (val:any, oldVal:any) : any => {
            // console.log('const onBeforeSend = (val:any, oldVal:any)', 
            //     val, oldVal,recentlyRecevied,recentlyRecevied !== val);
            if (!_.isEqual(recentlyRecevied, val)) {
                let sendData = opt.direction !== 'read';
                if (onBeforeSendCallback) {
                    const callbackOpt = {proceed:true, key:args.key, path:args.storeKey};
                    try {
                        onBeforeSendCallback(val, oldVal, callbackOpt);
                        sendData = callbackOpt.proceed;
                    }
                    catch(e) {
                        console.warn(e);
                    }
                }

                if (sendData) {
                    if (args.isForPage)
                        args.recentlySent = args.vm.sendPageData(val, args.storeKey,{key:args.key, path:args.storeKey});
                    else
                        args.recentlySent = args.vm.sendGlobalData(val, args.storeKey,{key:args.key, path:args.storeKey});
                }
            }
        }

        args.vm.$watch(args.key, onBeforeSend, {deep:!!opt.deep,immediate:!!opt.immediate,});
        const dataCallback = args.isForPage ? args.vm.setPageDataCallback : args.vm.setGlobalDataCallback;
        const onBeforeReceive = opt.direction !== 'write' && opt.onBeforeReceive && typeof opt.onBeforeReceive === 'function' ? opt.onBeforeReceive : null;
        dataCallback((data:any,updater?:any) => {
            const updaterPath = updater && updater.path ? (updater.path as string) : "";

            //컴포넌트 초기화 때 
            //이 시점에 프로퍼티에 undefind가 설정되면 
            //프로퍼티가 반응성 기능을 하지 못한다.
            if (data === undefined)
                return;
            
            const nested = updaterPath.length > args.storeKey.length && updaterPath.startsWith(args.storeKey);
            if ((args.recentlySent != data && args.vm[args.key] != data) || nested) {
                // console.log('vm.setPageDataCallback => if (recentlySent != data && vm[key] != data)'
                //     , key, recentlySent, data, updaterPath, nested, vm[key]);
                let acceptData = opt.direction !== 'write';
                if (onBeforeReceive) {
                    const callbackOpt = {proceed:true, key:args.key, path:args.storeKey, updaterPath};
                    try {
                        onBeforeReceive(data, args.vm[args.key], callbackOpt);
                        acceptData = callbackOpt.proceed;
                    }
                    catch(e) {
                        console.warn(e);
                    }
                }

                if (acceptData) {
                    if (typeof(data) == "object"){
                        //vm[key] = recentlyRecevied = {...data};
                        Object.getOwnPropertyNames(data).forEach(
                            (val) => {
                                Vue.set(args.vm[args.key], val, data[val]);
                            }
                        );
                        // recentlyRecevied = data;
                    }
                    else if (Array.isArray(data)) {
                        const targetArray = args.vm[args.key] as Array<any>;
                        targetArray.length = 0;
                        (data as Array<any>).forEach((item) => {
                            targetArray.push(item);
                        });
                        // recentlyRecevied = data;
                        //vm[key] = recentlyRecevied = [...data];
                    }
                    else
                        // vm[key] = recentlyRecevied = data;
                        args.vm[args.key] = data;

                    recentlyRecevied = _.cloneDeep(args.vm[args.key]);
                    // vm.$data[key] = recentlyRecevied = data;
                    // console.log('data updated with received one', vm[key]);
                }
            }
        }, args.storeKey);
    }

    // private initPageDataService() {
    //     if (!this.dataTranManager.pageDataService) {
    //         this.dataTranManager.pageDataService = new AnyTypeStoreService();
    //         console.log("dataTranManager.pageDataService created");
    //     }
    // }

    private readonly globalDataServiceKey = "$$GLOBAL_STORE_SERVICE$$";

    public sendGlobalData(data:any, storePath:string, sendOpt?:any) {
        const service : AnyTypeStoreService | undefined  = this.dataTranManager.findOfCreateGlobalService(this.globalDataServiceKey);
        if (service) {
            service.sendData(data, sendOpt, storePath);
        }
    }

    public setGlobalDataCallback(callback: (data: any, updater?:any) => void, storePath:string) {
        const service : AnyTypeStoreService | undefined  = this.dataTranManager.findOfCreateGlobalService(this.globalDataServiceKey);
        if (service) {
            this.subscriptionsForGlobal.push(
                service.$state.subscribe(({payload,updater}) => {
                    try {
                        const filtered = _.get(payload, storePath);
                        // console.log('setPageDataCallback => received:', payload, storePath, filtered);
                        callback(filtered, updater);
                    } catch (e) {
                        console.warn('setGlobalDataCallback', e);
                    }
                })
            );
        }
    }

    public sendPageData(data:any, path:string, sendOpt?:any) {
        // if (!this.dataTranManager.pageDataService)
        //     this.dataTranManager.pageDataService = new AnyTypeStoreService();

        // console.log('sendPageData', data, path);
        return this.dataTranManager.pageDataService?.sendData(data, sendOpt, path);
    }

    public setPageDataCallback(callback: (data: any, updater?:any) => void, storePath:string) {
        // this.initPageDataService();

        if (this.dataTranManager.pageDataService) {
            this.subscriptionsForPage.push(
                // this.dataTranManager.pageDataService.$state.subscribe(state => {
                this.dataTranManager.pageDataService.$state.subscribe(({payload,updater}) => {
                    try {
                        const filtered = _.get(payload, storePath);
                        // console.log('setPageDataCallback => received:', payload, storePath, filtered);
                        callback(filtered, updater);
                    } catch (e) {
                        console.warn('setPageDataCallback', e);
                    }
                })
            );
        }
    }

    public sendPageCommand(command:string, argument?:any) {
        // this.initPageDataService();
        
        this.dataTranManager.pageDataService?.sendCommand(command, argument);
    }

    public setPageCommandCallback(callback: (command:string, argument?:any) => void) {
        // this.initPageDataService();

        if (this.dataTranManager.pageDataService) {
            this.subscriptionsForPage.push(
                this.dataTranManager.pageDataService.$command.subscribe(command => {
                    try {
                        callback(command.command, command.argument);
                    } catch (e) {
                        console.warn('setPageCommandCallback', e);
                    }
                })
            );
        }

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