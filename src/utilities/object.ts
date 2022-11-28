/**
 * Returns the type name of a given value.
 */
export function getTypeOf(value: unknown): string {
  return Object.prototype.toString.call(value).toLowerCase().slice(8, -1);
}
