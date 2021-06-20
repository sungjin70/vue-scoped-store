import Component from 'vue-class-component';
import Vue from 'vue';
import _ from 'lodash';

import {AnyTypeStoreService} from "./core/any-type-store-service";
import {scopedStoreManager} from "./scoped-store-manager";
import { Subscription } from 'rxjs';

@Component
export default class ScopedStoreComponent extends Vue {

    private scopedSubscriptions:Subscription[] = [];
    private globalSubscriptions:Subscription[] = [];

    created() {

    }

    public sendGlobalData(key:string, data:any, path?:string) {
        const service : AnyTypeStoreService | undefined  = scopedStoreManager.findOfCreateGlobalService(key);
        if (service) {
            service.sendData(data, '', path);
        }
    }

    public setGlobalDataCallback(key:string, callback: (data: any) => void, path?:string) {
        const service : AnyTypeStoreService | undefined  = scopedStoreManager.findOfCreateGlobalService(key);
        if (service) {
            this.globalSubscriptions.push(
                service.$data.subscribe(stat => {
                    callback(stat);
                    }
                )
            );
        }
    }

    beforeDestory() {
        console.log('beforeDestory()');
        for (const k in this.globalSubscriptions) {
            this.globalSubscriptions[k].unsubscribe();
        }

        for (const k in this.scopedSubscriptions) {
            this.scopedSubscriptions[k].unsubscribe();
        }
    }

}