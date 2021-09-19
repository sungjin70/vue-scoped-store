import {BaseStoreService} from './base-store-service';
import { Observable } from '../rxjs-simple';
import clonedeep from 'lodash.clonedeep';
import set from 'lodash.set';

export interface AnyTypeState {
    updater:{};
    payload: object|null;
}

export interface StringTypeCommand {
    sender?:{};
    command:string;
    argument?: any;
}

const initialState: AnyTypeState = {
    updater:{},
    payload: null
}

export class AnyTypeStoreService extends BaseStoreService<AnyTypeState, StringTypeCommand> {

    public $state: Observable<any|null> = this.select(state => state);
    public $payload: Observable<any|null> = this.select(state => state.payload);
    public $command: Observable<StringTypeCommand> = this.selectCommand(command => command);

    constructor() {
      super(initialState)
    }

    public sendData(payload: any, sendOpt:{}, path?:string) {
        let copy = clonedeep(payload);
        // console.log('sendData (after cloneDeep)', payload, copy);
        let state:any;
        if (!path) {
            state = {
                updater: {...sendOpt},
                payload: {
                ...this.state.payload,
                ...copy,
                },
            };
        }
        else {
            state = {
                updater: {...sendOpt},
                payload: {
                ...this.state.payload,
                },
            };

            if (!state.payload)
                state.payload = {};

            set(state.payload, path, copy);
        }

        // setTimeout(() => {
            this.setState(state);
        // }, 0);

        return copy;
    }

    public sendCommand(command: string, argument?:any, sender?:string) {
        const commandObj: StringTypeCommand = {
            sender,
            command,
            argument,
        };

        this.setCommand(commandObj);
    }
}
