import { isPresent } from '../guards';
import { Option } from '../primitives/option';
import { Iter, Maybe } from '../types';

/**
 * Checks that every index is within the array's bounds.
 */
function withinBounds<T>(arr: T[], a: number, ...b: number[]): boolean {
  const indexes = [a, ...b];
  const len = arr.length;
  return indexes.every(i => i < len);
}

/**
 * Get the index for both possitive and negative indexes.
 */
function getIndex<T>(arr: T[], index: number): number {
  if (index < 0) return arr.length + index;
  return index;
}

/**
 * Convert an `Iterable` or `ArrayLike` into an `Array`.
 */
export function toArray<T>(iter: Iter<T>): T[] {
  return Array.from(iter);
}

/**
 * Performs the specified action for each element in the `Iterable`.
 */
export function each<T>(
  iter: Iter<T>,
  callbackfn: (value: T, index: number) => void
): void {
  return toArray(iter).forEach(callbackfn);
}

/**
 * Calls a defined callback function on each element of an `Iterable`, and returns an array that contains the results.
 */
export function map<T, U>(
  iter: Iter<T>,
  callbackfn: (value: T, index: number) => U
): U[] {
  return toArray(iter).map(callbackfn);
}

/**
 * Returns the elements of an `Iterable` that meet the condition specified in a callback function.
 */
export function filter<T, S extends T>(
  iter: Iter<T>,
  predicate: (value: T, index: number) => value is S
): S[] {
  return toArray(iter).filter(predicate);
}

/**
 * Returns the value of the first element in the `Iterable` where predicate is true, as an `Option`.
 */
export function find<T, S extends T>(
  iter: Iter<T>,
  predicate: (value: T, index: number) => value is S
): Option<S> {
  return Option.of(toArray(iter).find(predicate));
}

/**
 * Returns the value of the last element in the `Iterable` where predicate is true, as an `Option`.
 */
export function findLast<T, S extends T>(
  iter: Iter<T>,
  predicate: (value: T, index: number) => value is S
): Option<S> {
  return Option.of(reverse(iter).find(predicate));
}

/**
 * Returns the index of the first element in the `Iterable` where predicate is true, as an `Option`.
 */
export function findIndex<T>(
  iter: Iter<T>,
  predicate: (value: T, index: number) => unknown
): Option<number> {
  const index = toArray(iter).findIndex(predicate);
  return index >= 0 ? Option.some(index) : Option.none();
}

/**
 * Returns the index of the last element in the `Iterable` where predicate is true, as an `Option`.
 */
export function findLastIndex<T>(
  iter: Iter<T>,
  predicate: (value: T, index: number) => unknown
): Option<number> {
  const index = reverse(iter).findIndex(predicate);
  return index >= 0 ? Option.some(index) : Option.none();
}

/**
 * Returns a new array with all sub-array elements concatenated into it recursively up to the specified depth.
 */
export function flat<T, D extends number = 1>(
  iter: Iter<T>,
  depth?: D
): FlatArray<T[], D>[] {
  return toArray(iter).flat(depth);
}

/**
 * Calls a defined callback function on each element of an `Iterable`. Then, flattens the result into a new array.
 * This is identical to a map followed by flat with depth 1.
 */
export function flatMap<T, U>(
  iter: Iter<T>,
  callbackfn: (value: T, index: number) => U | ReadonlyArray<U>
): U[] {
  return toArray(iter).flatMap(callbackfn);
}

/**
 * Combines two or more `Iterable`.
 */
export function concat<T>(iter: Iter<T>, ...items: Iter<T>[]): T[] {
  return toArray(iter).concat(...items.map(toArray));
}

/**
 * Returns the item located at the specified index as an `Option`.
 */
export function at<T>(iter: Iter<T>, index: number): Option<T> {
  const arr = toArray(iter);
  index = index < 0 ? arr.length + index : index;
  return Option.of(arr[index]);
}

/**
 * Calls the specified callback function for all the elements in an `Iterable`. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 */
export function reduce<T, U>(
  iter: Iter<T>,
  initialValue: U,
  callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U
): U {
  return toArray(iter).reduce(callbackfn, initialValue);
}

/**
 * Calls the specified callback function for all the elements in an `Iterable`, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 */
export function reduceRight<T, U>(
  iter: Iter<T>,
  initialValue: U,
  callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U
): U {
  return toArray(iter).reduceRight(callbackfn, initialValue);
}

/**
 * Returns the first element in an `Iterable` as an `Option`.
 */
export function first<T>(iter: Iter<T>): Option<T> {
  return at(iter, 0);
}

/**
 * Returns the last element in an `Iterable` as an `Option`.
 */
export function last<T>(iter: Iter<T>): Option<T> {
  return at(iter, -1);
}

/**
 * Removes any `null` or `undefined` values from the `Iterable`.
 */
export function compact<T>(iter: Iter<Maybe<T>>): T[] {
  return filter(iter, isPresent);
}

/**
 * Removes duplicates from an `Iterable`.
 */
export function unique<T>(iter: Iter<T>): T[] {
  return toArray(new Set(toArray(iter)));
}

/**
 * Randomizes the elements in an `Iterable` using the Fisher-Yates algorithm.
 */
export function shuffle<T>(iter: Iter<T>): T[] {
  const arr = toArray(iter);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/**
 * Appends new elements to the end of an `Iterable`, and returns the new array.
 */
export function append<T>(iter: Iter<T>, ...items: T[]): T[] {
  return [...toArray(iter), ...items];
}

/**
 * Appends new elements to the begining of an `Iterable`, and returns the new array.
 */
export function prepend<T>(iter: Iter<T>, ...items: T[]): T[] {
  return [...items, ...toArray(iter)];
}

/**
 * Takes (N) elements from the beginning of the `Iterable`.
 */
export function take<T>(iter: Iter<T>, count: number): T[] {
  if (count < 0) return [];
  return toArray(iter).slice(0, count);
}

/**
 * Drops the first (N) elements from the `Iterable`.
 */
export function drop<T>(iter: Iter<T>, count: number): T[] {
  if (count < 0) return [];
  return toArray(iter).slice(count);
}

/**
 * Inserts an element at a given index and returns the new array. If the index is out of bounds, the operation will be skipped.
 */
export function insert<T>(iter: Iter<T>, element: T, index: number): T[] {
  const arr = toArray(iter);
  index = getIndex(arr, index);
  if (!withinBounds(arr, index)) return arr;
  arr.splice(index, 0, element);
  return arr;
}

/**
 * Removes an element at a given index and returns the new array. If the index is out of bounds, the operation will be skipped.
 */
export function remove<T>(iter: Iter<T>, index: number): T[] {
  const arr = toArray(iter);
  if (!withinBounds(arr, index)) return arr;
  arr.splice(index, 1);
  return arr;
}

/**
 * Swaps position of two elements in an `Iterable`. If either index is out of bounds, the operation will be skipped.
 */
export function swap<T>(iter: Iter<T>, a: number, b: number): T[] {
  const arr = toArray(iter);
  if (!withinBounds(arr, a, b)) return arr;
  const tmp = arr[b];
  arr[b] = arr[a];
  arr[a] = tmp;
  return arr;
}

/**
 * Moves one element from index A to index B. If either index is out of bounds, the operation will be skipped.
 */
export function move<T>(iter: Iter<T>, from: number, to: number): T[] {
  const arr = toArray(iter);
  if (!withinBounds(arr, from, to)) return arr;
  const item = arr.splice(from, 1)[0];
  arr.splice(to, 0, item);
  return arr;
}

/**
 * Sorts an `Iterable`.
 * This function does not mutates the original iterable and returns a new array.
 */
export function sort<T>(iter: Iter<T>, sortfn?: (a: T, b: T) => number): T[] {
  return toArray(iter).sort(sortfn);
}

/**
 * Reverses the elements in an `Iterable`.
 * This function does not mutates the original iterable and returns a new array.
 */
export function reverse<T>(iter: Iter<T>): T[] {
  const arr = toArray(iter);
  arr.reverse();
  return arr;
}

/**
 * Determines whether an `Iterable` includes a certain element, returning true or false as appropriate.
 */
export function includes<T>(
  iter: Iter<T>,
  searchElement: T,
  fromIndex?: number
): boolean {
  return toArray(iter).includes(searchElement, fromIndex);
}
