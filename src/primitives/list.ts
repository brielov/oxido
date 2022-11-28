import { Iter, Maybe } from '../types';
import * as U from '../utilities/iterable';
import { Option } from './option';

export class List<T> implements Iterable<T> {
  private constructor(private value: T[]) {}

  *[Symbol.iterator]() {
    const arr = this.value;
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      yield arr[i];
    }
  }

  /**
   * Create an empty `List`.
   */
  public static empty<T>(): List<T> {
    return new List([]);
  }

  /**
   * Creates a new `List` from an `Iterable`.
   */
  public static of<T>(iter: Iter<Maybe<T>>): List<T> {
    return new List(U.compact(iter));
  }

  /**
   * Performs the specified action for each element in the `List`.
   */
  public each(callbackfn: (value: T, index: number) => void): this {
    U.each(this, callbackfn);
    return this;
  }

  /**
   * Calls a defined callback function on each element of the `List`, and returns a new `List` that contains the results.
   */
  public map<U>(callbackfn: (value: T, index: number) => U): List<U> {
    return List.of(U.map(this, callbackfn));
  }

  /**
   * Returns a new `List` of the elements that meet the condition specified in a callback function.
   */
  public filter<S extends T>(
    predicate: (value: T, index: number) => value is S
  ): List<S> {
    return List.of(U.filter(this, predicate));
  }

  /**
   * Returns the value of the first element in the `List` where predicate is true, as an `Option`.
   */
  public find<S extends T>(
    predicate: (value: T, index: number) => value is S
  ): Option<T> {
    return U.find(this, predicate);
  }

  /**
   * Returns the value of the first element in the `List` where predicate is true, as an `Option`.
   */
  public findLast<S extends T>(
    predicate: (value: T, index: number) => value is S
  ): Option<S> {
    return U.find(this, predicate);
  }

  /**
   * Returns the index of the first element in the `List` where predicate is true, as an `Option`.
   */
  public findIndex(predicate: (value: T, index: number) => unknown) {
    return U.findIndex(this, predicate);
  }

  /**
   * Returns the index of the last element in the `List` where predicate is true, as an `Option`.
   */
  public findLastIndex(predicate: (value: T, index: number) => unknown) {
    return U.findLastIndex(this, predicate);
  }

  /**
   * Returns a new `List` with all sub-array elements concatenated into it recursively up to the specified depth.
   */
  public flat<D extends number = 1>(depth?: D): List<FlatArray<T[], D>> {
    return List.of(U.flat(this, depth));
  }

  /**
   * Calls a defined callback function on each element of the `List`. Then, flattens the result into a new `List`.
   * This is identical to a map followed by flat with depth 1.
   */
  public flatMap<U>(callbackfn: (value: T, index: number) => U): List<U> {
    return List.of(U.flatMap(this, callbackfn));
  }

  /**
   * Combines two or more `List`.
   */
  public concat(...items: List<T>[]): List<T> {
    return List.of(U.concat(this, ...items));
  }

  /**
   * Returns the item located at the specified index as an `Option`.
   */
  public at(index: number): Option<T> {
    return U.at(this, index);
  }

  /**
   * Calls the specified callback function for all the elements in the `List`. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   */
  public reduce<U>(
    initialValue: U,
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U
  ): U {
    return U.reduce(this, initialValue, callbackfn);
  }

  /**
   * Calls the specified callback function for all the elements in the `List`, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   */
  public reduceRight<U>(
    initialValue: U,
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U
  ): U {
    return U.reduceRight(this, initialValue, callbackfn);
  }

  /**
   * Returns the first element in the `List` as an `Option`.
   */
  public first(): Option<T> {
    return U.first(this);
  }

  /**
   * Returns the last element in the `List` as an `Option`.
   */
  public last(): Option<T> {
    return U.last(this);
  }

  /**
   * Removes duplicates from the `List`.
   */
  public unique(): List<T> {
    return List.of(U.unique(this));
  }

  /**
   * Randomizes the elements in the `List` using the Fisher-Yates algorithm.
   */
  public shuffle(): List<T> {
    return List.of(U.shuffle(this));
  }

  /**
   * Takes (N) elements from the beginning of the `List`.
   */
  public take(count: number): List<T> {
    return List.of(U.take(this, count));
  }

  /**
   * Drops the first (N) elements from the `List`.
   */
  public drop(count: number): List<T> {
    return List.of(U.drop(this, count));
  }

  /**
   * Returns a new sorted `List`.
   */
  public sort(sortfn?: (a: T, b: T) => number): List<T> {
    return List.of(U.sort(this, sortfn));
  }

  /**
   * Returns a new reversed `List`.
   */
  public reverse(): List<T> {
    return List.of(U.reverse(this));
  }

  /**
   * Determines whether the `List` includes a certain element, returning true or false as appropriate.
   */
  public includes(searchElement: T, fromIndex?: number): boolean {
    return U.includes(this, searchElement, fromIndex);
  }

  /**
   * Returns a shallow copy of the `List`.
   */
  public clone(): List<T> {
    return List.of(this);
  }

  /**
   * Calls the callback function with a shapshot of the `List`.
   */
  public inspect(callbackfn: (snapshot: List<T>) => void): this {
    callbackfn(this.clone());
    return this;
  }

  /**
   * Appends new elements to the end of the `List`, and returns a new `List`.
   * This method mutates the underlyling data structure.
   */
  public append(...items: T[]): this {
    this.value = U.append(this, ...items);
    return this;
  }

  /**
   * Appends new elements to the beginning of the `List`, and returns a new `List`.
   * This method mutates the underlyling data structure.
   */
  public prepend(...items: T[]): this {
    this.value = U.prepend(this, ...items);
    return this;
  }

  /**
   * Inserts an element at a given index and returns the new `List`. If the index is out of bounds, the operation will be skipped.
   * This method mutates the underlyling data structure.
   */
  public insert(element: T, index: number): this {
    this.value = U.insert(this, element, index);
    return this;
  }

  /**
   * Removes an element at a given index and returns the new `List`. If the index is out of bounds, the operation will be skipped.
   * This method mutates the underlyling data structure.
   */
  public remove(index: number): this {
    this.value = U.remove(this, index);
    return this;
  }

  /**
   * Swaps position of two elements in the `List` and returns a new `List`. If either index is out of bounds, the operation will be skipped.
   * This method mutates the underlyling data structure.
   */
  public swap(a: number, b: number): this {
    this.value = U.swap(this, a, b);
    return this;
  }

  /**
   * Moves one element from index A to index B and returns a new `List`. If either index is out of bounds, the operation will be skipped.
   * This method mutates the underlyling data structure.
   */
  public move(from: number, to: number): this {
    this.value = U.move(this, from, to);
    return this;
  }

  /**
   * Empties the current `List` in place.
   * This method mutates the underlyling data structure.
   */
  public clear(): this {
    this.value = [];
    return this;
  }

  /**
   * Removes the last element from the `List` and returns it as an `Option`.
   * This method mutates the underlyling data structure.
   */
  public pop(): Option<T> {
    return Option.of(this.value.pop());
  }

  /**
   * Removes the first element from the `List` and returns it as an `Option`.
   * This method mutates the underlyling data structure.
   */
  public shift(): Option<T> {
    return Option.of(this.value.shift());
  }

  /**
   * Converts the `List` into an `Array`.
   */
  public toArray(): T[] {
    return U.toArray(this);
  }
}
