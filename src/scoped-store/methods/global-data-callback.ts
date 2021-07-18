export function sendGlobalData(data:any, storePath:string, sendOpt?:any) {
    const vm = this;
    vm.sendGlobalData(data, storePath, sendOpt);
}

export function setGlobalDataCallback(callback: (data: any, updater?:any) => void, storePath:string) {
  const vm = this as any;
  vm.setGlobalDataCallback(callback, storePath);
}

export function sendGlobalCommand(key:string, command:string, argument?:any) {
  const vm = this as any;
  vm.sendGlobalCommand(key, command, argument);
}

export function setGlobalCommandCallback(key:string, callback: (command: string, argument?: any) => void) {
  const vm = this as any;
  vm.setGlobalCommandCallback(key, callback);
}