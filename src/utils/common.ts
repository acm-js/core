export function isNumber(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function mixin(constructor: any) {
  return (ctors: any[]) => {
    ctors.forEach(ctor => {
      Object.getOwnPropertyNames(ctor.prototype).forEach(name => {
        Object.defineProperty(
          constructor.prototype,
          name,
          Object.getOwnPropertyDescriptor(ctor.prototype, name)
        );
      });

      Object.getOwnPropertySymbols(ctor.prototype).forEach(symbol => {
        Object.defineProperty(
          constructor.prototype,
          symbol,
          Object.getOwnPropertyDescriptor(ctor.prototype, symbol)
        );
      });
    });
  }
}
