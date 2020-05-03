export interface IUpdateable<T = void> {
  update(time?: number): T;
}
