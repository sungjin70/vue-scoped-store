
export function sendPageData(data, path, sendOpt) {
  const vm = this;
  vm.sendPageData(data, path, sendOpt);
}

export function setPageDataCallback(callback, path) {
  const vm = this;
  vm.setPageDataCallback(callback, path);
}

export function sendPageCommand(command, argument) {
  const vm = this;
  vm.sendPageCommand(command, argument);
}

export function setPageCommandCallback(callback) {
  const vm = this;
  vm.setPageCommandCallback(callback);
}
