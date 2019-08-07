// @TODO: Continue to "type" out globals and enhanced features of the library by hand. (pun intended)
// @REF: https://github.com/DefinitelyTyped/DefinitelyTyped
// @REF: https://code-examples.net/en/docs/typescript/handbook/declaration-files/templates/global-plugin-d-ts

// @TODO: Programmatically generate this file with JSDoc comments for entries based on AT-DOC parsing from app/repo.
// @: This content then shows up in autocompletion dialogs while coding in vscode.
// @: Ensures we don't miss a definition by relying on the framework reflection.
interface String {
  toInt(): Number;
}

declare namespace assert {
  function count(n: number): Number | Boolean;

  function fail(
    actual?: any,
    expected?: any,
    message?: string,
    operator?: string
  ): void;

  function ok(value: any, message?: string): void;
  function equal(actual: any, expected: any, message?: string): void;
  function notEqual(actual: any, expected: any, message?: string): void;
  function deepEqual(actual: any, expected: any, message?: string): void;
  function notDeepEqual(actual: any, expected: any, message?: string): void;
  function deepStrictEqual(actual: any, expected: any, message?: string): void;
  function strictEqual(actual: any, expected: any, message?: string): void;
  function notStrictEqual(actual: any, expected: any, message?: string): void;
  function throws(block: () => void, message?: string): void;

  function throws(
    block: () => void,
    error: (() => void) | ((err: any) => boolean) | RegExp,
    message?: string
  ): void;

  function doesNotThrow(block: () => void, message?: string): void;

  function doesNotThrow(
    block: () => void,
    error: (() => void) | ((err: any) => boolean) | RegExp,
    message?: string
  ): void;

  function ifError(value: any): void;

  class AssertionError implements Error {
    name: string;
    message: string;
    actual: any;
    expected: any;
    operator: string;
    generatedMessage: boolean;

    constructor(options?: {
      message?: string;
      actual?: any;
      expected?: any;
      operator?: string;
      stackStartFunction?: () => void;
    });
  }
}
