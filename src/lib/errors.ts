// tslint:disable:max-classes-per-file

abstract class CustomError extends Error {
  constructor(...params: any[]) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }

  get name() {
    // Get error name from class name
    return this.constructor.name;
  }
}

export class BadBoundingBox extends CustomError {}
