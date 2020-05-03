import request, { Options as RequestOptions, RequestPromise } from 'request-promise';
import { IDestroyable } from '../types';
import { isNumber } from '../utils';

export class Requestable implements IDestroyable {
  protected requests: RequestPromise[] = [];

  public destroy(): void {
    this.cancelAllRequests();
  }

  protected request<T = any>(options: RequestOptions): RequestPromise<T> {
    const promise = request(options);

    this.requests.push(promise);

    return promise;
  }

  protected cancelRequest(requestOrIndex: RequestPromise | number) {
    const indexToDelete = isNumber(requestOrIndex)
      ? (requestOrIndex as number)
      : this.requests.findIndex(item => item === requestOrIndex);

    const promise = this.requests[indexToDelete];

    if (indexToDelete >= 0) {
      this.requests.splice(indexToDelete, 1);
    }

    promise?.cancel();
  }

  protected cancelAllRequests() {
    this.requests.forEach(promise => promise?.cancel());
    this.requests = [];
  }
}
