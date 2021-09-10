
export function sendGlobalData(data, storePath, sendOpt) {
    const vm = this;
    vm.sendGlobalData(data, storePath, sendOpt);
}

export function setGlobalDataCallback(callback, storePath) {
  const vm = this;
  vm.setGlobalDataCallback(callback, storePath);
}

export function sendGlobalCommand(key, command, argument) {
  const vm = this;
  vm.sendGlobalCommand(key, command, argument);
}

export function setGlobalCommandCallback(key, callback) {
  const vm = this;
  vm.setGlobalCommandCallback(key, callback);
}