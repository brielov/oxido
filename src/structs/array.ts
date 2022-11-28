import { isArray } from '../guards';
import { Result } from '../primitives';
import { Struct } from '../types';
import { createErr, ErrorKind } from './error';

export function array<T>(type: Struct<T>): Struct<T[]> {
  return input => {
    if (!isArray(input)) {
      return Result.err(
        createErr(ErrorKind.Assignment, { input, expected: 'array' })
      );
    }

    const copy: T[] = new Array(input.length);
    const len = input.length;

    for (let i = 0; i < len; i++) {
      const result = type(input[i]);

      if (result.isErr()) {
        const err = result.unwrapErr();
        err.path.unshift(i.toString());
        return Result.err(err);
      }
    }

    return Result.ok(copy);
  };
}
