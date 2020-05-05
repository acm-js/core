export function inherits(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    const names = [
      ...Object.getOwnPropertyNames(baseCtor.prototype),
      ...Object.getOwnPropertySymbols(baseCtor.prototype)
    ];

    names.forEach(name =>
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      )
    );
  });
}
