export function keys (instance): any {
  if (instance.then) {
    return instance.then(keys);
  }
  if (Array.isArray(instance)) {
    return instance.map(item => keys(item));
  }
  return Object.keys(instance.__proto__);
}
