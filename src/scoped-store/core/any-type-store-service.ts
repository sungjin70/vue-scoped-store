import {BaseStoreService} from './base-store-service';
import { Observable } from 'rxjs';
import _ from 'lodash';

export interface AnyTypeState {
    updater:string;
    payload: object|null;
}

const initialState: AnyTypeState = {
    updater:'',
    payload: null
}

export class AnyTypeStoreService extends BaseStoreService<AnyTypeState> {
    // public $state: Observable<AnyTypeState> = this.select(state => state);

    public $data: Observable<object|null> = this.select(state => state.payload);

    constructor() {
      super(initialState)
    }

    private selectDataFromOthers(receiver:string) {
        return this.select(state => state)
            .filter(({updater}) => receiver != updater)
            .map(state => state.payload);
    }

    public selectData(path:string, receiver?:string) {
        let result;
        if (receiver) {
            result = this.selectDataFromOthers(receiver)
        }
        else {
            result = this.select(state => state.payload);
        }
        
        return result.map(payload => _.get(payload, path));
    }

    public sendData(payload: any, sender:string, path?:string) {
        if (!path) {
            this.setState({
                updater: sender,
                payload: {
                ...this.state.payload,
                ...payload,
                },
            });
        }
        else {
            const state = {
                updater: sender,
                payload: {
                ...this.state.payload,
                },
            };

            if (!state.payload)
                state.payload = {};

            _.set(state.payload,path,payload);
            this.setState(state);
        }
    }
}
