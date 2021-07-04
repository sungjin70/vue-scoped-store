export function sendGlobalData(key:string, data:any, path?:string) {
    const vm = this;
    vm.sendGlobalData(key, data, path);
}

export function setGlobalDataCallback(key:string, callback: (data: any) => void, path?:string) {
  const vm = this as any;
  vm.setGlobalDataCallback(key, callback, path);
}

export function sendGlobalCommand(key:string, command:string, argument?:any) {
  const vm = this as any;
  vm.sendGlobalCommand(key, command, argument);
}

export function setGlobalCommandCallback(key:string, callback: (command: string, argument?: any) => void) {
  const vm = this as any;
  vm.setGlobalCommandCallback(key, callback);
}