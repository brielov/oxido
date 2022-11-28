import { isBoolean } from '../guards';
import { Result } from '../primitives';
import { Struct } from '../types';
import { createErr, ErrorKind } from './error';

export const boolean: Struct<boolean> = input => {
  if (isBoolean(input)) return Result.ok(input);
  return Result.err(
    createErr(ErrorKind.Assignment, { input, expected: 'boolean' })
  );
};
