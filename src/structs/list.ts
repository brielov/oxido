import { List, Result } from '../primitives';
import { Struct } from '../types';
import { array } from './array';

export function list<T>(type: Struct<T>): Struct<List<T>> {
  const struct = array(type);
  return input => struct(input).andThen(value => Result.ok(List.of(value)));
}
