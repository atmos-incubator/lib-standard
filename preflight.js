require('./index');

// Enforce pre-commit checks via this script and report to console

// @TODO: Grep for AT-COMMIT and error out with their messages printed to console
// @: These are useful for writing todos about the work in progress that need to be fixed before committing.

// @TODO: ask for a commit message based on this standard: https://www.conventionalcommits.org/en/v1.0.0-beta.4/
// @: If break: starts the message, bump the Major version (UNLESS! the version is less than 1.0.0 at which point it is ok to change the API)
// @: Use the previous git commit version so that preflight failures don't keep bumping the number)
// @: If msg starts with 'fix:' bump the PATCH.
// @: If msg starts with 'feat:' bump the MINOR.
// @: List options before asking for input:
// @: break: feat:, fix:, chore:, docs:, style:, refactor:, perf:, test:, ci:, build:,
// @: Define a list of standard scopes we should allow.

// @TODO: check that % of comments to locs > 10% (excluding test files)
// @NOTE: cloc --exclude-lang=Markdown --progress-rate=10 --csv --not-match-f='-test-?' src

// @TODO: run a git diff to see how much has changed and complain if diff is too large
// @: git diff --no-prefix -U0 > diff.txt
// @: Ignore -test and -test-web modifications in this constraint.
// @: Ignore package-lock.json changes

// @TODO: Grep for AT-TODO tags
// @: Process tags that were completed, added and modified into a change.md file
// @: Save a formatted git commit message according to https://www.conventionalcommits.org/en/v1.0.0-beta.4/

// @TODO: Warn about improper casing of AT-tags (all upper, restricted to keywords (var, todo, bug, note, doc, consider, ref))
// @: Create a ref-checker that looks for AT-REF tags and stores a local <root>/refs/<short-guid>.md file of the content pertinent in that url.

// @TODO: Compile a summary report of the above testing / coverage / cloc / AT-TODO tags / etc and save to status.md
// @NOTE: cloc --exclude-lang=Markdown --csv src

// @TODO: Warn if assertions are removed in the dit diff or if the number of tests is lower than the previous commit.
// 100% coverage doesn't mean 100% tested.  We generally don't want to remove tests even if supplanted by different tests.

// @TODO: Generate svg badges for coverage / build status

// @TODO: Grep for debug\(, alert\( and log\( calls in the source diff and warn about them

// @TODO: Check for CRLF newlines and convert to LF

// @TODO: Check for lower-case usage of at-tags and insist capitalization
