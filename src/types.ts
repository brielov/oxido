import { Result } from './primitives';
import { StructError } from './structs/error';

/**
 * Represents either null or undefined.
 */
export type Nil = null | undefined;

/**
 * Represents either the value itself or `Nil`.
 */
export type Maybe<T> = T | Nil;

/**
 * Represents a plain javascript object.
 */
export type PlainObject = { [key: string]: unknown };

export type Shape = { [key: string]: Struct };

export type InferShape<T> = T extends Shape
  ? {
      [K in keyof T]: T[K] extends Struct<infer U> ? U : never;
    }
  : never;

/**
 * Represents a generic function.
 */
export type Fn = (...args: unknown[]) => unknown;

/**
 * Represents everything `Array.from` supports.
 */
export type Iter<T> = Iterable<T> | ArrayLike<T>;

/**
 * A union of the 7 javascript primitives.
 */
export type Primitive =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | undefined
  | null;

/**
 * Represents a function that accepts an `unknown` value and returns a `Result` with the expected output.
 */
export type Struct<O = unknown, I = unknown> = (
  input: I
) => Result<O, StructError>;

export type FlatArray<Arr, Depth extends number> = {
  done: Arr;
  recur: Arr extends ReadonlyArray<infer InnerArr>
    ? FlatArray<
        InnerArr,
        [
          -1,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20
        ][Depth]
      >
    : Arr;
}[Depth extends -1 ? 'done' : 'recur'];
