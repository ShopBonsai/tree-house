interface IErrorType {
  code: string;
  message: string;
}

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toThrowApiError(status: number, error: IErrorType): Promise<R>;
    }
  }
}
