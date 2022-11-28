import { isString } from '../guards';
import { Result } from '../primitives';
import { Struct } from '../types';
import { createErr, ErrorKind } from './error';

export const string: Struct<string> = input => {
  if (isString(input)) return Result.ok(input);
  return Result.err(
    createErr(ErrorKind.Assignment, { expected: 'string', input })
  );
};

export const asString: Struct<string> = input => {
  return string(String(input));
};
