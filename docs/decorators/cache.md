# What's this?

@cache is function/method cache implementation of ES decorator.

## Usage

### Method cache.

```typescript
import {
  cache,
  CacheType,
  CacheScope
} from '@acm-js/core';

class Example {
  @cache({type: CacheType.MEMO, scope: CacheScope.INSTANCE})
  public expensiveCalc(args) {...}
}
```

### Function cache

```typescript
import {
  cache,
  CacheType,
  CacheScope
} from '@acm-js/core';

const cachedFn = fcache((args: Object) => {
  ...
}, {type: CacheType.MEMO})
```

## Cache Options

```
interface CacheOption {
  type?: CacheType;
  scope?: CacheScope;
  ttl?: number;
  compare?: (prev: any, next: any) => boolean;
}
```

### `type: CacheType`

*default value:* `CacheType.SINGLETON`

**`SINGLETON`**

* 1. Search caches.
* 2. If found, return cache value, otherwise call function and set result to cache.
* 3. Return result.


**`MEMO`**

* 1. Search caches with passed arguments and compare them with other cached arguments.
* 2. If value is found, return it otherwise call function and set pair of return value and arguments to cache.
* 3. Return result.


### `scope: CacheScope`

*default value:* `CacheScope.INSTANCE`

**`INSTANCE`**

Cache value is reserved in class instance, so new instance will be created, that instance has't have any cache value.  
Every instance has self cache.

**`GLOBAL`**

Reserve cache value to global area, so new instance will be created, but that instance return same cached value.


### `ttl: number`

*default value*: `null`

If ttl was specified, cached value was removed after specified milliseconds.


### `compare: Function`

*default value*: `(a, b) => a.length === b.length && a.every((v, i) => v === b[i])`

Arguments comparison function used if type is `MEMO`.  
Default value of this options is compare `===`.


## Contribute

Send PR!

