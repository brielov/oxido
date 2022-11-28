import { isNumber, isString } from '../guards';
import { Result } from '../primitives';
import { Struct } from '../types';
import { createErr, ErrorKind } from './error';

export const date: Struct<Date> = input => {
  if (input instanceof Date) {
    if (!isNumber(input.getTime())) {
      return Result.err(
        createErr(ErrorKind.Validation, {
          input,
          message: `The broader type is 'date' but it is actually invalid.`,
        })
      );
    }
    return Result.ok(input);
  }
  return Result.err(
    createErr(ErrorKind.Assignment, { input, expected: 'date' })
  );
};

export const asDate: Struct<Date> = input => {
  return date(isString(input) || isNumber(input) ? new Date(input) : input);
};
