export interface IUpdateable<T = void, R = number> {
  update(time?: number): T;
}
