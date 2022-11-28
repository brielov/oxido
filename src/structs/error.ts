import { getTypeOf } from '../utilities/object';

export enum ErrorKind {
  Assignment,
  Validation,
  Generic,
}

interface BaseError {
  input: unknown;
  message: string;
  path: string[];
}

export interface AssignmentError extends BaseError {
  kind: ErrorKind.Assignment;
  expected: string;
  actual: string;
}

export interface ValidationError extends BaseError {
  kind: ErrorKind.Validation;
}

export interface GenericError extends BaseError {
  kind: ErrorKind.Generic;
}

export type StructError = AssignmentError | ValidationError | GenericError;

interface CreateAssignmentErrOpts {
  input: unknown;
  expected: string;
  message?: string;
}

interface CreateErrDefaultOpts {
  input: unknown;
  message?: string;
}

function createAssignmentErr(opts: CreateAssignmentErrOpts): AssignmentError {
  const actual = getTypeOf(opts.input);
  return {
    actual,
    kind: ErrorKind.Assignment,
    message:
      opts.message ??
      `Type '${actual}' is not assignable to type '${opts.expected}'.`,
    path: [],
    ...opts,
  };
}

type CreateErrOpts<K extends ErrorKind> = K extends ErrorKind.Assignment
  ? CreateAssignmentErrOpts
  : CreateErrDefaultOpts;

export function createErr<K extends ErrorKind>(
  kind: K,
  opts: CreateErrOpts<K>
): Extract<StructError, { kind: K }> {
  switch (kind) {
    case ErrorKind.Assignment:
      // deno-lint-ignore no-explicit-any
      return createAssignmentErr(opts as CreateAssignmentErrOpts) as any;
    default:
      // deno-lint-ignore no-explicit-any
      return { kind, path: [], message: '', ...opts } as any;
  }
}
