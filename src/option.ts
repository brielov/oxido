import { Err, Ok, Result } from "./result.ts";

// deno-lint-ignore ban-types
type AnyType = {};
type Maybe<T> = T | null | undefined;

interface Impl<T extends AnyType> {
  and<U extends AnyType>(option: Option<U>): Option<U>;
  andThen<U extends AnyType>(fn: (value: T) => Option<U>): Option<U>;
  expect(message: string): T;
  filter(predicate: (value: T) => boolean): Option<T>;
  inspect(fn: (value: T) => void): Option<T>;
  isNone(): boolean;
  isSome(): boolean;
  isSomeAnd(fn: (value: T) => boolean): boolean;
  map<U extends AnyType>(fn: (value: T) => U): Option<U>;
  mapOr<U>(defaultValue: U, fn: (value: T) => U): U;
  mapOrElse<U>(fallback: () => U, fn: (value: T) => U): U;
  okOr<E>(err: E): Result<T, E>;
  okOrElse<E>(fn: () => E): Result<T, E>;
  or(option: Option<T>): Option<T>;
  orElse(fn: () => Option<T>): Option<T>;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(fallback: () => T): T;
  xor(option: Option<T>): Option<T>;
}

export class Option<T extends AnyType> implements Impl<T> {
  #value?: T;

  private constructor(value?: T) {
    this.#value = value;
  }

  match<U>(onSome: (value: T) => U, onNone: () => U): U {
    return typeof this.#value === "undefined" ? onNone() : onSome(this.#value);
  }

  static Some<T extends AnyType>(value: T): Option<T> {
    return new Option<T>(value);
  }

  static from<T extends AnyType>(value: Maybe<T>): Option<T> {
    if (typeof value === "undefined" || value === null) {
      return None as Option<T>;
    }
    return Some(value);
  }

  static None = new Option();

  and<U extends AnyType>(option: Option<U>): Option<U> {
    return this.match(() => option, () => this as unknown as Option<U>);
  }

  andThen<U extends AnyType>(fn: (value: T) => Option<U>): Option<U> {
    return this.match(fn, () => this as unknown as Option<U>);
  }

  expect(message: string): T {
    return this.match((value) => value, () => {
      throw new Error(message);
    });
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    if (this.isSomeAnd(predicate)) {
      return this;
    }
    return None as Option<T>;
  }

  inspect(fn: (value: T) => void): Option<T> {
    return this.match((value) => {
      fn(value);
      return this;
    }, () => this);
  }

  isNone() {
    return typeof this.#value === "undefined";
  }

  isSome() {
    return !this.isNone();
  }

  isSomeAnd(fn: (value: T) => boolean): boolean {
    return this.isSome() && fn(this.#value!);
  }

  map<U extends AnyType>(fn: (value: T) => U): Option<U> {
    return this.match(
      (value) => Some(fn(value)),
      () => this as unknown as Option<U>,
    );
  }

  mapOr<U>(defaultValue: U, fn: (value: T) => U): U {
    return this.match(fn, () => defaultValue);
  }

  mapOrElse<U>(fallback: () => U, fn: (value: T) => U): U {
    return this.match(fn, fallback);
  }

  okOr<E>(err: E): Result<T, E> {
    return this.match((value) => Ok(value), () => Err(err));
  }

  okOrElse<E>(fn: () => E): Result<T, E> {
    return this.match((value) => Ok(value), () => Err(fn()));
  }

  or(option: Option<T>): Option<T> {
    return this.match(() => this, () => option);
  }

  orElse(fn: () => Option<T>): Option<T> {
    return this.match(() => this, fn);
  }

  unwrap(): T {
    return this.match((value) => value, () => {
      throw new Error("called `Option.unwrap` on a `None` value");
    });
  }

  unwrapOr(defaultValue: T): T {
    return this.match((value) => value, () => defaultValue);
  }

  unwrapOrElse(fallback: () => T): T {
    return this.match((value) => value, fallback);
  }

  xor(option: Option<T>): Option<T> {
    if (this.isSome() && option.isNone()) return this;
    if (this.isNone() && option.isSome()) return option;
    return None as Option<T>;
  }
}

Object.freeze(Option.None);

export const { Some, None } = Option;
