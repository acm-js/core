import { EventEmitter } from 'events';
import { IKeyable, Key } from '../types';

export enum RegistryEventType {
  REGISTERED = 'register',
  UNREGISTERED = 'unregister'
}

export class Registry<T extends IKeyable, R = T> extends EventEmitter {
  protected registry: Map<Key, R> = new Map();

  public register(item: T, ...args: any[]): R {
    const key = item.uniqueKey;
    const existingItem = this.registry.get(key);

    if (existingItem) {
      return existingItem;
    }

    const wrappedItem = this.wrapRegistryItem(item, ...args);

    this.registry.set(key, wrappedItem);
    this.emit(RegistryEventType.REGISTERED, item, wrappedItem);

    return wrappedItem;
  }

  public unregister(item: T, ...args: any[]): void {
    const key = item.uniqueKey;
    const existingItem = this.registry.get(key);

    if (!existingItem) {
      return;
    }

    this.registry.delete(key);
    this.emit(RegistryEventType.UNREGISTERED, item, ...args);
  }

  public wrapRegistryItem(item: T, ...args: any[]): R {
    return item as unknown as R;
  }

  public unwrapRegistryItem(registryItem: R): T {
    return registryItem as unknown as T;
  }
}
