import { None, Option } from "./option.ts";

interface Impl<T, E> {
  and<U>(result: Result<U, E>): Result<U, E>;
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  err(): Option<E>;
  expect(message: string): T;
  expectErr(message: string): E;
  inspect(fn: (value: T) => void): Result<T, E>;
  inspectErr(fn: (error: E) => void): Result<T, E>;
  isErr(): boolean;
  isErrAnd(fn: (error: E) => boolean): boolean;
  isOk(): boolean;
  isOkAnd(fn: (value: T) => boolean): boolean;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  mapOr<U>(defaultValue: U, fn: (value: T) => U): U;
  mapOrElse<U>(fallback: (error: E) => U, fn: (value: T) => U): U;
  ok(): Option<T>;
  or<F>(result: Result<T, F>): Result<T, F>;
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;
  unwrap(): T;
  unwrapErr(): E;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(fallback: (error: E) => T): T;
}

export class Result<T, E> implements Impl<T, E> {
  #ok: boolean;
  #value: T | E;

  private constructor(ok: boolean, value: T | E) {
    this.#ok = ok;
    this.#value = value;
  }

  match<U>(onOk: (value: T) => U, onErr: (error: E) => U) {
    return this.#ok ? onOk(this.#value as T) : onErr(this.#value as E);
  }

  static Ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  static Err<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(false, error);
  }

  and<U>(result: Result<U, E>): Result<U, E> {
    return this.match(() => result, () => this as unknown as Result<U, E>);
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.match(fn, () => this as unknown as Result<U, E>);
  }

  err(): Option<E> {
    return this.match(() => None as Option<E>, Option.from);
  }

  expect(message: string): T {
    return this.match((value) => value, (cause) => {
      throw new Error(message, { cause });
    });
  }

  expectErr(message: string): E {
    return this.match((cause) => {
      throw new Error(message, { cause });
    }, (error) => error);
  }

  inspect(fn: (value: T) => void): Result<T, E> {
    if (this.#ok) {
      fn(this.#value as T);
    }
    return this;
  }

  inspectErr(fn: (error: E) => void): Result<T, E> {
    if (!this.#ok) {
      fn(this.#value as E);
    }
    return this;
  }

  isErr(): boolean {
    return !this.#ok;
  }

  isErrAnd(fn: (error: E) => boolean): boolean {
    return !this.#ok && fn(this.#value as E);
  }

  isOk(): boolean {
    return this.#ok;
  }

  isOkAnd(fn: (value: T) => boolean): boolean {
    return this.#ok && fn(this.#value as T);
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.match(
      (value) => Ok(fn(value)),
      () => this as unknown as Result<U, E>,
    );
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return this.match(
      () => this as unknown as Result<T, F>,
      (error) => Err(fn(error)),
    );
  }

  mapOr<U>(defaultValue: U, fn: (value: T) => U): U {
    return this.match(fn, () => defaultValue);
  }

  mapOrElse<U>(fallback: (error: E) => U, fn: (value: T) => U): U {
    return this.match(fn, fallback);
  }

  ok(): Option<T> {
    return Option.from(this.#value as T);
  }

  or<F>(result: Result<T, F>): Result<T, F> {
    return this.match(() => this as unknown as Result<T, F>, () => result);
  }

  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
    return this.match(() => this as unknown as Result<T, F>, fn);
  }

  unwrap(): T {
    return this.match((value) => value, (cause) => {
      throw new Error("called `Result.unwrap` on an `Err` value", { cause });
    });
  }

  unwrapErr(): E {
    return this.match(
      (cause) => {
        throw new Error("called `Result.unwrapErr` on an `Ok` value", {
          cause,
        });
      },
      (error) => error,
    );
  }

  unwrapOr(defaultValue: T): T {
    return this.match((value) => value, () => defaultValue);
  }

  unwrapOrElse(fallback: (error: E) => T): T {
    return this.match((value) => value, fallback);
  }
}

export const { Ok, Err } = Result;
