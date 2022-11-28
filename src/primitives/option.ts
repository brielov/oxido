import { isNil, isPresent } from '../guards';
import { Maybe } from '../types';
import { Result } from './result';

interface Pattern<T, O> {
  some(value: T): O;
  none(): O;
}

export class Option<T> {
  private constructor(private readonly value: T) {}

  public static some<T>(value: T): Option<T> {
    return new Option<T>(value);
  }

  public static none<T = unknown>(): Option<T> {
    return new Option<T>(void 0 as any);
  }

  public static of<T>(value: Maybe<T>): Option<T> {
    return isPresent(value) ? Option.some(value) : Option.none();
  }

  public isNone(): boolean {
    return isNil(this.value);
  }

  public isSome(): boolean {
    return !this.isNone();
  }

  public isSomeAnd(f: (value: T) => boolean): boolean {
    return this.isSome() && f(this.value);
  }

  public expect(msg: string): T {
    return this.match({
      some(value) {
        return value;
      },
      none() {
        throw new Error(msg);
      },
    });
  }

  public unwrap(): T {
    return this.match({
      some(value) {
        return value;
      },
      none() {
        throw new Error('called `Option::unwrap()` on a `None` value');
      },
    });
  }

  public unwrapOr(defaultValue: T): T {
    return this.match({
      some(value) {
        return value;
      },
      none() {
        return defaultValue;
      },
    });
  }

  public unwrapOrElse(f: () => T): T {
    return this.match({
      some(value) {
        return value;
      },
      none() {
        return f();
      },
    });
  }

  public map<U>(f: (value: T) => U): Option<U> {
    return this.match({
      some(value) {
        return Option.of(f(value));
      },
      none() {
        return Option.none();
      },
    });
  }

  public inspect(f: (value: T) => void): this {
    if (this.isSome()) {
      f(this.value);
    }
    return this;
  }

  public mapOr<U>(defaultValue: U, f: (value: T) => U): U {
    return this.match({
      some(value) {
        return f(value);
      },
      none() {
        return defaultValue;
      },
    });
  }

  public mapOrElse<U>(def: () => U, f: (value: T) => U): U {
    return this.match({
      some(value) {
        return f(value);
      },
      none() {
        return def();
      },
    });
  }

  public okOr<E>(err: E): Result<T, E> {
    return this.match({
      some(value) {
        return Result.ok(value);
      },
      none() {
        return Result.err(err);
      },
    });
  }

  public okOrElse<E>(err: () => E): Result<T, E> {
    return this.match({
      some(value) {
        return Result.ok(value);
      },
      none() {
        return Result.err(err());
      },
    });
  }

  public and<U>(optb: Option<U>): Option<U> {
    return this.match({
      some() {
        return optb;
      },
      none() {
        return Option.none();
      },
    });
  }

  public andThen<U>(f: (value: T) => Option<U>): Option<U> {
    return this.match({
      some(value) {
        return f(value);
      },
      none() {
        return Option.none();
      },
    });
  }

  public filter(predicate: (value: T) => boolean): Option<T> {
    if (this.isSome() && predicate(this.value)) return Option.of(this.value);
    return Option.none();
  }

  public or(optb: Option<T>): Option<T> {
    return this.match({
      some(value) {
        return Option.of(value);
      },
      none() {
        return optb;
      },
    });
  }

  public orElse(f: () => Option<T>): Option<T> {
    return this.match({
      some(value) {
        return Option.of(value);
      },
      none() {
        return f();
      },
    });
  }

  public match<O>(pattern: Pattern<T, O>): O {
    const { value } = this;
    return this.isNone() ? pattern.none() : pattern.some(value);
  }
}
