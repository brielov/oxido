import { Option } from './option';

interface Pattern<T, E, O> {
  ok(value: T): O;
  err(err: E): O;
}

export class Result<T, E = unknown> {
  private constructor(
    private readonly _ok: boolean,
    private readonly value: T | E
  ) {}

  public static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  public static err<E, T = unknown>(err: E): Result<T, E> {
    return new Result<T, E>(false, err);
  }

  public isOk(): boolean {
    return this._ok;
  }

  public isOkAnd(f: (value: T) => boolean): boolean {
    return this.isOk() && f(this.value as T);
  }

  public isErr(): boolean {
    return !this.isOk();
  }

  public isErrAnd(f: (err: E) => boolean): boolean {
    return this.isErr() && f(this.value as E);
  }

  public ok(): Option<T> {
    return this.match({
      ok(value) {
        return Option.some(value);
      },
      err() {
        return Option.none();
      },
    });
  }

  public err(): Option<E> {
    return this.match({
      ok() {
        return Option.none();
      },
      err(err) {
        return Option.some(err);
      },
    });
  }

  public map<U>(op: (value: T) => U): Result<U, E> {
    return this.match({
      ok(value) {
        return Result.ok(op(value));
      },
      err(err) {
        return Result.err(err);
      },
    });
  }

  public mapOr<U>(defaultValue: U, f: (value: T) => U): U {
    return this.match({
      ok(value) {
        return f(value);
      },
      err() {
        return defaultValue;
      },
    });
  }

  public mapOrElse<U>(defaultValue: (err: E) => U, f: (value: T) => U): U {
    return this.match({
      ok(value) {
        return f(value);
      },
      err(err) {
        return defaultValue(err);
      },
    });
  }

  public mapErr<F>(op: (err: E) => F): Result<T, F> {
    return this.match({
      ok(value) {
        return Result.ok(value);
      },
      err(err) {
        return Result.err(op(err));
      },
    });
  }

  public inspect(f: (value: T) => void): this {
    return this.match({
      ok: value => {
        f(value);
        return this;
      },
      err: () => {
        return this;
      },
    });
  }

  public inspectErr(f: (err: E) => void): this {
    return this.match({
      ok: () => {
        return this;
      },
      err: err => {
        f(err);
        return this;
      },
    });
  }

  public expect(msg: string): T {
    return this.match({
      ok(value) {
        return value;
      },
      err(err) {
        throw new Error(`${msg}: ${err}`);
      },
    });
  }

  public unwrap(): T {
    return this.match({
      ok(value) {
        return value;
      },
      err() {
        throw new Error('called `Result::unwrap()` on an `Err` value');
      },
    });
  }

  public expectErr(msg: string): E {
    return this.match({
      ok(value) {
        throw new Error(`${msg}: ${value}`);
      },
      err(err) {
        return err;
      },
    });
  }

  public unwrapErr(): E {
    return this.match({
      ok() {
        throw new Error('called `Result::unwrapErr()` on an `Ok` value');
      },
      err(err) {
        return err;
      },
    });
  }

  public and<U>(res: Result<U, E>): Result<U, E> {
    return this.match({
      ok() {
        return res;
      },
      err(err) {
        return Result.err(err);
      },
    });
  }

  public andThen<U>(op: (value: T) => Result<U, E>): Result<U, E> {
    return this.match({
      ok(value) {
        return op(value);
      },
      err(err) {
        return Result.err(err);
      },
    });
  }

  public or<F>(res: Result<T, F>): Result<T, F> {
    return this.match({
      ok(value) {
        return Result.ok(value);
      },
      err() {
        return res;
      },
    });
  }

  public orElse<F>(op: (err: E) => Result<T, F>): Result<T, F> {
    return this.match({
      ok(value) {
        return Result.ok(value);
      },
      err(err) {
        return op(err);
      },
    });
  }

  public unwrapOr(defaultValue: T): T {
    return this.match({
      ok(value) {
        return value;
      },
      err() {
        return defaultValue;
      },
    });
  }

  public unwrapOrElse(op: (err: E) => T): T {
    return this.match({
      ok(value) {
        return value;
      },
      err(err) {
        return op(err);
      },
    });
  }

  public match<O>(pattern: Pattern<T, E, O>): O {
    const { value } = this;
    return this.isOk() ? pattern.ok(value as T) : pattern.err(value as E);
  }
}
