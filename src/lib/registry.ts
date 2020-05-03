import { EventEmitter } from 'events';
import { IKeyable, Key } from '../types';

export enum RegistryEventType {
  REGISTER = 'register'
}

export class Registry<T extends IKeyable> extends EventEmitter {
  private registry: Map<Key, T> = new Map();

  public register(item: T): T {
    const key = item.uniqueKey;
    const existingItem = this.registry.get(key);

    if (existingItem) {
      return existingItem;
    }

    this.emit(RegistryEventType.REGISTER, item);

    this.registry.set(key, item);

    return item;
  }
}
