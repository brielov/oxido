import { Result } from '../primitives';
import { Struct } from '../types';
import { createErr, ErrorKind } from './error';

export const number: Struct<number> = input => {
  if (typeof input === 'number') {
    if (!Number.isFinite(input)) {
      return Result.err(
        createErr(ErrorKind.Validation, {
          input,
          message: `The broader type is 'number' but the narrower type is 'NaN'.`,
        })
      );
    }
    return Result.ok(input);
  }
  return Result.err(
    createErr(ErrorKind.Assignment, { input, expected: 'number' })
  );
};

export const asNumber: Struct<number> = input => {
  return number(Number(input));
};
