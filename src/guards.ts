import type { Fn, Maybe, Nil, PlainObject, Primitive } from "./types";

/**
 * Narrows down value to a `string`.
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Narrows down value to a valid `number`. `NaN` is not considered a `number`.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Narrows down value to a `boolean`.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Narrows down value to a `bigint`.
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === "bigint";
}

/**
 * Narrows down value to a `symbol`.
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === "symbol";
}

/**
 * Narrows down value to `undefined`.
 */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

/**
 * Narrows down value to `null`.
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

const primitives = [
  isString,
  isNumber,
  isBoolean,
  isBigInt,
  isSymbol,
  isNull,
  isUndefined,
];

/**
 * Narrows down value to any of the seven javascript primitives.
 */
export function isPrimitive(value: unknown): value is Primitive {
  return primitives.some((fn) => fn(value));
}

/**
 * Narrows down value to an `array` of `unknown` values.
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Narrows down value to an `object` of `unknown` values.
 */
export function isObject(value: unknown): value is PlainObject {
  if (isPrimitive(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Narrows down value to a valid `date`. Invalid `date` is not considered a `date`.
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && isNumber(value.getTime());
}

/**
 * Narrows down value to a `function`.
 */
export function isFunction(value: unknown): value is Fn {
  return typeof value === "function";
}

/**
 * Narrows down value to a `regexp`.
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Narrows down value to either `null` or `undefined`.
 */
export function isNil(value: unknown): value is Nil {
  return isNull(value) || isUndefined(value);
}

/**
 * Narrows down value to be of type `T` and not `Nil`.
 */
export function isPresent<T>(value: Maybe<T>): value is T {
  return !isNil(value);
}
