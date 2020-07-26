export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchObjectInArray(obj: {}): R;
    }
  }
}
