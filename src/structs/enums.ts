import { isNumber, isString } from '../guards';
import { Result } from '../primitives';
import { Struct } from '../types';
import { createErr, ErrorKind } from './error';

export function enums<T extends string | number>(values: T[]): Struct<T> {
  return input => {
    if (isString(input) || isNumber(input)) {
      if (values.includes(input as T)) {
        return Result.ok(input as T);
      }

      return Result.err(
        createErr(ErrorKind.Validation, {
          input,
          message: `Expecting one of ${values.join(' | ')}`,
        })
      );
    }

    return Result.err(
      createErr(ErrorKind.Assignment, { input, expected: 'string | number' })
    );
  };
}
