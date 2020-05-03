export type Constructor<T> = new (...args: any[]) => T;
export type Mixin<T> = Constructor<T> | object;

function mix(client: Constructor<any>, mixins: Mixin<any>[]) {
  const clientKeys = Object.getOwnPropertyNames( client.prototype );
  for (const mixin of mixins) {
    const mixinMixables = getMixables(clientKeys, mixin);
    Object.defineProperties( client.prototype, mixinMixables );
  }
}

/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(clientKeys:string[], mixin: Mixin<any>) {
  let descriptors: PropertyDescriptorMap = {};

  const get = (obj: object) :PropertyDescriptorMap => {
    const map: PropertyDescriptorMap = {};

    Object.getOwnPropertyNames( obj ).map( key => {
      if( clientKeys.indexOf( key ) < 0 ) {
        const descriptor = Object.getOwnPropertyDescriptor( obj, key );
        if( descriptor === undefined ) return;
        if( descriptor.get || descriptor.set ) {
          map[ key ] = descriptor;
        } else if ( typeof descriptor.value === "function" ) {
          map[ key ] = descriptor;
        }
      }
    });

    return map;
  };

  switch (typeof mixin) {
    case "object":
      descriptors = get(mixin);
      break;
    case "function":
      descriptors = get((mixin as Constructor<any>).prototype);
      break;
  }

  return descriptors;
}

/**
 * Takes a list of classes or object literals and adds their methods
 * to the class calling it.
 */
export function use(...options: Mixin<any>[]) {
  return (target: any, propertyKey: string) => {
    mix(target.constructor, options.reverse());
  }
}
