/**
 * Takes a method as a parameter and add it to the class calling it.
 */
export function delegate(method: (...args: any[]) => any) {
  return (target: any, propertyKey: string) => {
    target.constructor.prototype[propertyKey] = method;
  }
}
