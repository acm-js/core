import { EventEmitter } from 'events';
import { IKeyable, Key } from '../types';

export enum RegistryEventType {
  REGISTER = 'register'
}

export class Registry<T extends IKeyable, R> extends EventEmitter {
  private registry: Map<Key, R> = new Map();

  public register(item: T, ...args: any[]): R {
    const key = item.uniqueKey;
    const existingItem = this.registry.get(key);

    if (existingItem) {
      return existingItem;
    }

    const wrappedItem = this.wrapRegistryItem(item, ...args);

    this.emit(RegistryEventType.REGISTER, item, wrappedItem);
    this.registry.set(key, wrappedItem);

    return wrappedItem;
  }

  public wrapRegistryItem(item: T, ...args: any[]): R {
    return item as unknown as R;
  }

  public unwrapRegistryItem(registryItem: R): T {
    return registryItem as unknown as T;
  }
}
