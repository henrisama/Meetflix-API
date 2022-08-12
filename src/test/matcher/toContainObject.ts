interface CustomMatchers<R = unknown> {
  toContainObject(floor: number, ceiling: number): R;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> extends CustomMatchers<R> {
      toContainObject: (argument: Record<string, any>) => CustomMatcherResult;
    }
  }
}

expect.extend({
  toContainObject(received, argument: Record<string, any>) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    );

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false,
      };
    }
  },
});

export default undefined;
