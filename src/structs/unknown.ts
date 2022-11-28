import { Result } from '../primitives';
import { Struct } from '../types';

export const unknown: Struct<unknown> = input => Result.ok(input);
