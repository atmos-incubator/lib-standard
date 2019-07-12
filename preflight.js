require('./index');

// Enforce pre-commit checks via this script and report to console

// @TODO: check that % of comments to locs > 30% (excluding test files)
  // @NOTE: cloc --exclude-lang=Markdown --progress-rate=10 --csv --not-match-f='-test-?' src

// @TODO: run a git diff to see how much has changed and complain if diff is too large
  // @: Ignore -test and -test-web modifications in this constraint.

// @TODO: Grep for AT-TODO tags and compile a backlog.md file (with AT tags removed)
  // @: Process tags that were completed, added and modified
  // @: Save a formatted git commit message according to https://www.conventionalcommits.org/en/v1.0.0-beta.4/

// @TODO: Warn about improper casing of AT-tags (all upper, restricted to keywords (var, todo, bug, note, doc, consider, ref))
  // @: Create a ref-checker that looks for AT-REF tags and stores a local <root>/refs/<short-guid>.md file of the content pertinent in that url.

// @TODO: Compile a summary report of the above testing / coverage / cloc / AT-TODO tags / etc and save to status.md
  // @NOTE: cloc --exclude-lang=Markdown --csv src

// @TODO: Warn if assertions are removed in the dit diff or if the number of tests is lower than the previous commit.
  // 100% coverage doesn't mean 100% tested.  We generally don't want to remove

// @TODO: Generate svg badges for coverage / build status

// @TODO: Grep for debug\(, alert\( and log\( calls in the source diff and warn about them

// @TODO: Check for CRLF newlines and convert to LF
