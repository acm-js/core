/**
 * @see https://github.com/acm-js/core/docs/decorators/cache.md
 */

/* tslint:disable:no-shadowed-variable ban-types max-classes-per-file */
const GLOBAL_SYMBOL = Symbol('__global_cache');

export enum CacheScope {
  GLOBAL = 1,
  INSTANCE
}

export enum CacheType {
  SINGLETON = 1,
  MEMO,
  TTL
}

export type Comparator<A = any, B = any> = (newVal: A, oldVal: B) => boolean;
export const DEFAULT_COMPARE_FN = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export type FunctionCacheOption = {
  type?: CacheType;
  ttl?: number;
  compare?: Comparator;
};

export type CacheOption = {
  scope?: CacheScope;
  type?: CacheType;
  ttl?: number;
  compare?: Comparator;
};

/**
 * Control caches lifetime.
 */
class Cache {
  constructor(
    private scope: CacheScope,
    private type: CacheType,
    private compare: Comparator,
    private ttl: number
  ) {}

  public set(val: any, args: any[], context: any, key: symbol): any {
    if (context[key]) {
      const result = context[key].filter(([value, cachedArgs]) =>
        this.compare(cachedArgs, args)
      );
      if (!result.length) {
        context[key].push([val, args]);
      }
    } else {
      context[key] = [[val, args]];
    }

    if (this.type === CacheType.TTL) {
      if (!this.ttl) {
        throw new Error('ttl required in CacheType.TTL');
      }

      setTimeout(() => (context[key] = null), this.ttl);
    }
    return val;
  }

  public get(context: any, key: symbol, args: any[]): any {
    if (this.type === CacheType.MEMO) {
      const caches = context[key] || [];

      return caches.filter(([value, cachedArgs]) =>
        this.compare(cachedArgs, args)
      )[0];
    }

    return (context[key] || [])[0];
  }
}

/**
 * Cache decorator.
 */
export function cache(param: CacheOption = {}) {
  const {
    scope = CacheScope.INSTANCE,
    type = CacheType.SINGLETON,
    compare = DEFAULT_COMPARE_FN,
    ttl = null
  } = param;

  const cache = new Cache(scope, type, compare, ttl);

  return (target: object, propertyKey: string | symbol): PropertyDescriptor => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      target,
      `${String(propertyKey)}`
    );
    const symbolKey = Symbol(
      `__cache_key__${typeof target === 'function' ? '__static:' : ''}${String(
        propertyKey
      )}`
    );

    if (scope === CacheScope.GLOBAL) {
      target[GLOBAL_SYMBOL] = {};
    }

    if (propertyDescriptor.set) {
      throw new Error("Setter function can't be memozied.");
    }

    const memoizedFn = (context: any, type: string, args: any[]) => {
      const cachedValue = cache.get(context, symbolKey, args);

      if (cachedValue && cachedValue.length) {
        return cachedValue[0];
      }

      return cache.set(
        propertyDescriptor[type].apply(context, args),
        args,
        context,
        symbolKey
      );
    };

    if (propertyDescriptor.get) {
      const descriptor: PropertyDescriptor = {
        configurable: propertyDescriptor.configurable,
        enumerable: propertyDescriptor.enumerable,
        get() {
          return memoizedFn(
            scope === CacheScope.INSTANCE ? this : target[GLOBAL_SYMBOL],
            'get',
            []
          );
        }
      };

      if (propertyDescriptor.set) {
        descriptor.set = propertyDescriptor.set;
      }

      return descriptor;
    }

    if (typeof propertyDescriptor.value !== 'function') {
      throw new Error(`Cacheable must be a function.`);
    }

    return {
      configurable: propertyDescriptor.configurable,
      writable: propertyDescriptor.writable,
      enumerable: propertyDescriptor.enumerable,
      value(...args: any[]) {
        return memoizedFn(
          scope === CacheScope.INSTANCE ? this : target[GLOBAL_SYMBOL],
          'value',
          args
        );
      }
    };
  };
}

export function fcache<T extends Function>(
  fn: T,
  param: FunctionCacheOption = {}
): T {
  const name = fn.name || `${Date.now() + Math.round(Math.random() * 10000)}`;

  class CacheWrapper {
    @cache(param)
    static [name](...args) {
      return fn(...args);
    }
  }

  return ((...args) => CacheWrapper[name](...args)) as any;
}
