import { Result } from '../primitives';
import { Struct } from '../types';

export function defaulted<T>(type: Struct<T>, defaultValue: T): Struct<T> {
  return input => type(input).orElse(() => Result.ok(defaultValue));
}
