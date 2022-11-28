import { isObject } from '../guards';
import { Result } from '../primitives';
import { InferShape, Shape, Struct } from '../types';
import { createErr, ErrorKind } from './error';

export function object<S extends Shape>(shape: S): Struct<InferShape<S>> {
  const entries = [...Object.entries(shape)];
  const len = entries.length;

  return input => {
    if (!isObject(input)) {
      return Result.err(
        createErr(ErrorKind.Assignment, { input, expected: 'object' })
      );
    }

    const copy = Object.create(null);

    for (let i = 0; i < len; i++) {
      const [key, type] = entries[i];
      const result = type(input[key]);

      if (result.isErr()) {
        const err = result.unwrapErr();
        err.path.unshift(key);
        return Result.err(err);
      }
    }

    return Result.ok(copy);
  };
}
