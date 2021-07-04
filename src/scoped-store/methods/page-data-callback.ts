
export function sendPageData(data:any, path:string) {
  const vm = this;
  vm.sendPageData(data, path);
}

export function setPageDataCallback(callback: (data: any) => void, path:string) {
  const vm = this;
  vm.setPageDataCallback(callback, path);
}

export function sendPageCommand(command:string, argument?:any) {
  const vm = this;
  vm.sendPageCommand(command, argument);
}

export function setPageCommandCallback(callback: (command:string, argument?:any) => void) {
  const vm = this;
  vm.setPageCommandCallback(callback);
}
