# Conventions

## Folder Structure

* docs

  Markdown files for documentation and readme links referenced by a root readme.md file.

* src
  * [js object/concept]

    These directories represent extensions to native objects like Error, Math, location etc

* test

  Bootstrap files needed to setup testing environments

  * fixtures

      A directory for json structures relied on for testing

## Coding Style

The code in this repository relies on a couple unique but important formatting standards outlined below.  These rules are designed to prevent mistakes on a large distributed codebase.

1. Keep functions short.

1. Document code with // comments only (no multi-line blocks, doc-comments or other)

    This allows for easier debugging by being able to comment out a swath of code by hand or programmatically without the need of complex tree parsing.

    1. AT-DOC tags are used to document functions.  Each function should start with an AT-DOC.
    1. AT-LICENSE blocks should exist at the bottom of a function closure.

1. Large data structures should appear after the logic that uses them.

1. Large files should group any immediately invoked logic in a local `main()` function that gets invoked at the bottom of the file.

1. Comments about a function, or block should go inside the scope when possible.

1. Comments about a variable should immediately precede the variable declaration.

1. Document your code, with whys not hows.

1. Rely on Prettier & ESLint formatting, and format before committing.

1. Don't leave cruft.

1. Refactor from a clean git state, not in conjunction with feature development.

1. Write unit tests for new code.

1. Write integration tests for bugs.

1. Explain your commit with detailed commit messages.
