import Component from 'vue-class-component';
import Vue from 'vue';
//import _ from 'lodash';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';

import { Subscription, BehaviorSubject } from './rxjs-simple';

import {AnyTypeStoreService, StringTypeCommand} from "./core/any-type-store-service";
import {scopedStoreManager} from "./scoped-store-manager";

import {WeakRef} from '@ungap/weakrefs';

export interface ScopedStore {
}

interface SetupStorePropertyArg {
    vm:any;
    key:any;
    keyStore:any;
    recentlySent:any;
    storeKey:string;
    isForPage:boolean;
}

const isNarrowPath = (storeKey:string) => {
    return storeKey.indexOf('.') > 0;
}

const acceptOrNot = (fromKey:string, toKey:string) => {
    if (fromKey == toKey)
        return true;

    const fromArr = fromKey.split('.');
    const toArr = toKey.split('.');
    if (fromArr.length > toArr.length) {
        for (let i=0;i<toArr.length;i++) {
            if (toArr[i] !== fromArr[i])
                return false;
        }
    }
    else {
        for (let i=0;i<fromArr.length;i++) {
            if (toArr[i] !== fromArr[i])
                return false;
        }
    }

    return true;
}

const globalDataServiceKey = "$$GLOBAL_STORE_SERVICE$$";

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
            //console.log('if (this.isPage) in ScopedStoreComponent.beforeDestroy()');
            this.pageDataService?.stop();
            // this.dataTranManager.pageDataService = undefined;
        }
    }

    private init() {
        const vm = this as any;

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
                const opt = gs[key];
                const storeKey = (opt.path || key) as string;
                const args:SetupStorePropertyArg = {vm,key,keyStore:gs,recentlySent:{},storeKey,isForPage:false};
                this.setupStoreProperty(args);

                this.pathMapForGlobal.set(key, opt);
            }
            
          })
        }
    }

    private setupStoreProperty(args:SetupStorePropertyArg) {
        const opt = args.keyStore[args.key];
        // const storeKey = (opt.path || key) as string;
        // console.log('registering scopped store for key=', key, storeKey);
        const onBeforeSendCallback = 
                opt.direction !== 'read' 
                && opt.onBeforeSend 
                && typeof opt.onBeforeSend === 'function' ? opt.onBeforeSend : null;
        let recentlyRecevied = {}; // to prevent feedback
        // let recentlySent = {}; // to prevent feedback
        const onBeforeSend = (val:any, oldVal:any) : any => {
            // console.log('const onBeforeSend = (val:any, oldVal:any)', 
            //     args.key, val, oldVal,recentlyRecevied,isEqual(recentlyRecevied, val));
                
            if (!isEqual(recentlyRecevied, val)) {
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
                    recentlyRecevied = {};
                    if (args.isForPage)
                        args.recentlySent = args.vm.sendPageData(val, args.storeKey,{key:args.key, path:args.storeKey});
                    else
                        args.recentlySent = args.vm.sendGlobalData(val, args.storeKey,{key:args.key, path:args.storeKey});

                    // console.log('const onBeforeSend, after sendData', 
                    //     val, args.storeKey,{key:args.key, path:args.storeKey});
                }
            }
        }

        args.vm.$watch(args.key, onBeforeSend, {deep:!!opt.deep,immediate:!!opt.immediate,});
        const dataCallback = args.isForPage ? args.vm.setPageDataCallback : args.vm.setGlobalDataCallback;
        const onBeforeReceive = opt.direction !== 'write' && opt.onBeforeReceive && typeof opt.onBeforeReceive === 'function' ? opt.onBeforeReceive : null;
        const onReceived = opt.direction !== 'write' && opt.onReceived && typeof opt.onReceived === 'function' ? opt.onReceived : null;
        dataCallback((data:any,updater?:any) => {
            //컴포넌트 초기화 때 프로퍼티에 undefind가 설정되면 
            //프로퍼티가 반응성 기능을 하지 못한다.
            if (data === undefined)
                return;

            const updaterPath = updater && updater.path ? updater.path as string : "";

            console.log('dataCallback => ', !updaterPath ? '(empty)':updaterPath, args.storeKey, data, args.vm[args.key], updater);

            //This function is called whenever the values of 
            //all managed variables change, so this check is required.
            if (!acceptOrNot(updaterPath, args.storeKey))
                return;
            
            const nested = updaterPath.length > args.storeKey.length && updaterPath.startsWith(args.storeKey);
            if ((typeof data !== "object" && args.vm[args.key] !== data) || (args.recentlySent != data && args.vm[args.key] != data) || nested) {
                // console.log('dataCallback => if ((args.recentlySent != data && args.vm[args.key] != data) || nested)', data, updaterPath, nested);
                let acceptData = opt.direction !== 'write';
                if (onBeforeReceive) {
                    const callbackOpt = {proceed:true, key:args.key, path:args.storeKey, updaterPath};
                    try {
                        onBeforeReceive.call(args.vm, data, args.vm[args.key], callbackOpt);
                        acceptData = callbackOpt.proceed;
                    }
                    catch(e) {
                        console.warn(e);
                    }
                }

                if (acceptData) {
                    if (Array.isArray(data)) {
                        let targetArray = args.vm[args.key] as Array<any>;
                        if (targetArray)
                            targetArray.length = 0;
                        else {
                            args.vm[args.key] = targetArray = [];
                        }

                        data.forEach((item) => {
                            targetArray.push(item);
                        });

                        data = [...data];
                        // recentlyRecevied = data;
                        //vm[key] = recentlyRecevied = [...data];
                    }
                    else if (typeof(data) == "object"){
                        //vm[key] = recentlyRecevied = {...data};
                        Object.getOwnPropertyNames(data).forEach(
                            (val) => {
                                Vue.set(args.vm[args.key], val, data[val]);
                            }
                        );
                        args.vm[args.key] = {...args.vm[args.key]};
                        // recentlyRecevied = data;
                    }
                    else
                        // vm[key] = recentlyRecevied = data;
                        args.vm[args.key] = data;

                    recentlyRecevied = cloneDeep(args.vm[args.key]);
                    // console.log('data updated with received one', vm[key]);
                    if (onReceived) {
                        onReceived.call(args.vm, args.vm[args.key]);
                        // onReceived(args.vm[args.key]);
                    }
                }
            }
        }, args.storeKey);
    }

    private readonly senderIdentity = {};

    public sendGlobalData(data:any, storePath:string, sendOpt?:any) {
        const service : AnyTypeStoreService | undefined  = this.dataTranManager.findOfCreateGlobalService(globalDataServiceKey);
        if (!sendOpt) 
            sendOpt = {identity:new WeakRef(this.senderIdentity), path:storePath};
        else if (!sendOpt.identity)
            sendOpt.identity = new WeakRef(this.senderIdentity);
        
        // console.log('sendGlobalData => ', data, sendOpt, storePath);
        service?.sendData(data, sendOpt, storePath);
    }

    public setGlobalDataCallback(callback: (data: any, updater?:any) => void, storePath:string) {
        const service : AnyTypeStoreService | undefined  = this.dataTranManager.findOfCreateGlobalService(globalDataServiceKey);
        if (service) {
            let isFirst = true;
            this.subscriptionsForGlobal.push(
                service.$state.subscribe(({payload,updater}) => {
                    try {
                        if (updater.identity?.deref() === this.senderIdentity)
                            return;
                        const filtered = get(payload, storePath);
                        // console.log('setGlobalDataCallback => received:', payload, storePath, filtered);
                        if (filtered !== undefined) {
                            if (isFirst) {
                                /*
                                Required when a component is created and called for the first time.
                                Modify the updater so that the first call is unconditionally received.
                                */
                                const updaterPath = updater && updater.path ? (updater.path as string) : "";
                                const tUpdater = {...updater, path:storePath};
                                callback(filtered, tUpdater);
                                isFirst = false;
                            }
                            else
                                callback(filtered, updater);
                        }
                    } catch (e) {
                        console.warn('setGlobalDataCallback', e);
                    }
                })
            );
        }
    }

    public sendPageData(data:any, storePath:string, sendOpt?:any) {
        // if (!this.dataTranManager.pageDataService)
        //     this.dataTranManager.pageDataService = new AnyTypeStoreService();

        // console.log('sendPageData', data, storePath);

        if (!sendOpt) 
            sendOpt = {identity:new WeakRef(this.senderIdentity), path:storePath};
        else if (!sendOpt.identity)
            sendOpt.identity = new WeakRef(this.senderIdentity);
            
        return this.dataTranManager.pageDataService?.sendData(data, sendOpt, storePath);
    }

    public setPageDataCallback(callback: (data: any, updater?:any) => void, storePath:string) {
        // this.initPageDataService();

        if (this.dataTranManager.pageDataService) {
            // this.dataTranManager.pageDataService.$state.subscribe(state => {
            let sub = this.dataTranManager.pageDataService.$state.subscribe(({payload,updater}) => {
                    try {
                        if (updater.identity?.deref() === this.senderIdentity)
                            return;
                        const filtered = get(payload, storePath);
                        // console.log('setPageDataCallback => received:', payload, storePath, filtered);
                        if (filtered !== undefined)
                            callback(filtered, updater);
                    } catch (e) {
                        console.warn('setPageDataCallback', e);
                    }
                })
            this.subscriptionsForPage.push(sub);
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